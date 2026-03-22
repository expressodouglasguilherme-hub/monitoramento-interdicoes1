import { chromium, Browser, Page } from 'playwright';
import { Event, RawEvent, ScrapingResult } from '../types';
import { DataTransformer } from '../utils/transformer';
import { logger } from '../utils/logger';

interface ScraperConfig {
  url: string;
  timeout: number;
}

export class ScraperService {
  private browser: Browser | null = null;
  private config: ScraperConfig;
  private isScrapingInProgress = false;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.browser) {
      return;
    }

    try {
      logger.info('Initializing Playwright browser');
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });
      logger.info('Browser initialized');
    } catch (error) {
      logger.error('Failed to initialize browser', { error: (error as Error).message });
      // Don't throw - allow server to start even if browser fails
      this.browser = null;
    }
  }

  async scrape(): Promise<ScrapingResult> {
    if (this.isScrapingInProgress) {
      logger.warn('Scraping already in progress, skipping');
      return {
        success: false,
        data: [],
        duration: 0,
        error: 'Scraping already in progress',
      };
    }

    this.isScrapingInProgress = true;
    const startTime = Date.now();
    let page: Page | null = null;

    try {
      await this.initialize();

      if (!this.browser) {
        throw new Error('Browser not initialized - Playwright may have failed to start');
      }

      logger.info('Starting scraping', { url: this.config.url });

      page = await this.browser.newPage({
        viewport: { width: 1920, height: 1080 },
      });

      await page.goto(this.config.url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout,
      });

      await this.waitForPowerBILoad(page);
      const rawEvents = await this.extractEvents(page);
      const events = DataTransformer.transform(rawEvents);

      const duration = Date.now() - startTime;
      logger.info('Scraping completed', { 
        eventsCount: events.length, 
        duration: `${duration}ms` 
      });

      return {
        success: true,
        data: events,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = (error as Error).message;
      logger.error('Scraping failed', { error: errorMessage, duration: `${duration}ms` });

      return {
        success: false,
        data: [],
        duration,
        error: errorMessage,
      };
    } finally {
      if (page) {
        await page.close().catch(err => logger.error('Failed to close page', { error: err.message }));
      }
      this.isScrapingInProgress = false;
    }
  }

  private async waitForPowerBILoad(page: Page): Promise<void> {
    logger.debug('Waiting for Power BI to load');
    await page.waitForSelector('.visual-container', { timeout: 30000 });
    await page.waitForTimeout(2000); // Additional wait for data to render
    logger.debug('Power BI loaded');
  }

  private async extractEvents(page: Page): Promise<RawEvent[]> {
    logger.debug('Extracting events from Power BI');

    const rawEvents = await page.evaluate(() => {
      const events: RawEvent[] = [];

      // NOTE: These selectors need to be adjusted based on the actual Power BI structure
      // Use Playwright Inspector to identify correct selectors:
      // npx playwright codegen https://estradasbloqueadas.com.br

      // Example: Extract from table rows
      const rows = document.querySelectorAll('table tbody tr');
      
      rows.forEach((row: Element) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
          events.push({
            cidade: cells[0]?.textContent?.trim(),
            uf: cells[1]?.textContent?.trim(),
            local: cells[2]?.textContent?.trim(),
            observacao: cells[3]?.textContent?.trim(),
            dataAtualizacao: cells[4]?.textContent?.trim(),
            // Coordinates might need to be extracted from map markers or data attributes
            latitude: 0, // TODO: Extract from actual data
            longitude: 0, // TODO: Extract from actual data
          });
        }
      });

      return events;
    });

    logger.debug('Events extracted', { count: rawEvents.length });
    return rawEvents;
  }

  async close(): Promise<void> {
    if (this.browser) {
      logger.info('Closing browser');
      await this.browser.close();
      this.browser = null;
      logger.info('Browser closed');
    }
  }
}
