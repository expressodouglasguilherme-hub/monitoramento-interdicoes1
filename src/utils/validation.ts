/**
 * Form validation utilities
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 9.1, 9.2, 9.3
 */

import { VALID_UF_LIST } from '../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate cidade field
 * 
 * Requirements: 9.1, 9.3
 * 
 * @param cidade - City name to validate
 * @returns ValidationResult
 */
export function validateCidade(cidade: string): ValidationResult {
  if (!cidade || cidade.trim() === '') {
    return {
      isValid: false,
      error: 'O campo Cidade é obrigatório',
    };
  }

  if (cidade.length > 100) {
    return {
      isValid: false,
      error: 'O campo Cidade deve ter no máximo 100 caracteres',
    };
  }

  return { isValid: true };
}

/**
 * Validate UF field
 * 
 * Requirements: 9.2, 9.3
 * 
 * @param uf - State abbreviation to validate
 * @returns ValidationResult
 */
export function validateUF(uf: string): ValidationResult {
  if (!uf || uf.trim() === '') {
    return {
      isValid: false,
      error: 'O campo UF é obrigatório',
    };
  }

  if (uf.length !== 2) {
    return {
      isValid: false,
      error: 'UF deve ter exatamente 2 caracteres',
    };
  }

  const upperUF = uf.toUpperCase();
  if (!VALID_UF_LIST.includes(upperUF as any)) {
    return {
      isValid: false,
      error: 'UF deve ser uma sigla válida de estado brasileiro',
    };
  }

  return { isValid: true };
}

/**
 * Validate local field
 * 
 * Requirements: 9.1, 9.3
 * 
 * @param local - Location description to validate
 * @returns ValidationResult
 */
export function validateLocal(local: string): ValidationResult {
  if (!local || local.trim() === '') {
    return {
      isValid: false,
      error: 'O campo Local é obrigatório',
    };
  }

  if (local.length > 200) {
    return {
      isValid: false,
      error: 'O campo Local deve ter no máximo 200 caracteres',
    };
  }

  return { isValid: true };
}

/**
 * Validate observacao field
 * 
 * Requirements: 9.1, 9.3
 * 
 * @param observacao - Observation text to validate
 * @returns ValidationResult
 */
export function validateObservacao(observacao: string): ValidationResult {
  if (!observacao || observacao.trim() === '') {
    return {
      isValid: false,
      error: 'O campo Observação é obrigatório',
    };
  }

  if (observacao.length > 500) {
    return {
      isValid: false,
      error: 'O campo Observação deve ter no máximo 500 caracteres',
    };
  }

  return { isValid: true };
}

/**
 * Validate all form fields
 * 
 * @param data - Form data to validate
 * @returns Object with validation results for each field
 */
export function validateFormData(data: {
  cidade: string;
  uf: string;
  local: string;
  observacao: string;
}): {
  isValid: boolean;
  errors: {
    cidade?: string;
    uf?: string;
    local?: string;
    observacao?: string;
  };
} {
  const cidadeResult = validateCidade(data.cidade);
  const ufResult = validateUF(data.uf);
  const localResult = validateLocal(data.local);
  const observacaoResult = validateObservacao(data.observacao);

  const errors: any = {};
  if (!cidadeResult.isValid) errors.cidade = cidadeResult.error;
  if (!ufResult.isValid) errors.uf = ufResult.error;
  if (!localResult.isValid) errors.local = localResult.error;
  if (!observacaoResult.isValid) errors.observacao = observacaoResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
