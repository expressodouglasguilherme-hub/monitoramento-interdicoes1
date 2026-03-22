import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Config, Event } from './types';
import { ScraperService } from './services/scraper';
import { CacheManager } from './services/cache';
import { logger } from './utils/logger';
import { Server as HttpServer } from 'http';

export class Server {
  private app: Express;
  private config: Config;
  private scraperService: ScraperService;
  private cacheManager: CacheManager<Event[]>;
  private httpServer: HttpServer | null = null;

  constructor(config: Config) {
    this.config = config;
    this.app = express();
    
    this.scraperService = new ScraperService({
      url: config.powerbiUrl,
      timeout: config.scrapingTimeoutMs,
    });
    
    this.cacheManager = new CacheManager<Event[]>(config.cacheDurationMs);
    
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    // JSON body parser with 1MB limit
    this.app.use(express.json({ limit: '1mb' }));

    // CORS configuration
    const corsOptions: cors.CorsOptions = {
      origin: this.config.allowedOrigins.length > 0 
        ? this.config.allowedOrigins 
        : true, // Allow all origins in development
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    // Rate limiting: 60 requests per minute per IP
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 60,
      message: 'Too many requests from this IP, please try again later',
    });
    this.app.use(limiter);

    // Security headers
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
      });
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get('/api/events', this.handleGetEvents.bind(this));
    this.app.get('/health', this.handleHealth.bind(this));
  }

  private async handleGetEvents(req: Request, res: Response): Promise<void> {
    try {
      const cacheEntry = this.cacheManager.get('events');

      // If cache is valid (not expired), return cached data
      if (cacheEntry && !this.cacheManager.isExpired(cacheEntry)) {
        logger.info('Returning cached events', { count: cacheEntry.data.length });
        res.json(cacheEntry.data);
        return;
      }

      // Cache is expired or doesn't exist, perform scraping
      logger.info('Cache miss or expired, performing scraping');
      const result = await this.scraperService.scrape();

      if (result.success) {
        // Update cache with fresh data
        this.cacheManager.set('events', result.data);
        logger.info('Scraping successful, cache updated', { count: result.data.length });
        res.json(result.data);
        return;
      }

      // Scraping failed, use stale cache if available
      if (cacheEntry) {
        logger.warn('Scraping failed, returning stale cache', { 
          count: cacheEntry.data.length,
          error: result.error 
        });
        res.json(cacheEntry.data);
        return;
      }

      // No cache and scraping failed, return empty array
      logger.error('Scraping failed and no cache available', { error: result.error });
      res.json([]);
    } catch (error) {
      logger.error('Error in handleGetEvents', { error: (error as Error).message });
      res.json([]);
    }
  }

  private handleHealth(req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }

  async start(): Promise<void> {
    try {
      await this.scraperService.initialize();
    } catch (error) {
      logger.error('Failed to initialize scraper, server will start anyway', { 
        error: (error as Error).message 
      });
    }
    
    this.httpServer = this.app.listen(this.config.port, () => {
      logger.info('Server started', { 
        port: this.config.port,
        powerbiUrl: this.config.powerbiUrl,
      });
    });
  }

  async stop(): Promise<void> {
    logger.info('Stopping server');
    
    await this.scraperService.close();
    
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer!.close(() => {
          logger.info('Server stopped');
          resolve();
        });
      });
    }
  }
}
