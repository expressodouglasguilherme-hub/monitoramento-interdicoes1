/**
 * ReportFormModal - Modal form for reporting new events
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 9.3, 9.4, 9.5
 */

import React from 'react';
import { NewEventData } from '../types';
import { validateCidade, validateUF, validateLocal, validateObservacao } from '../utils/validation';
import { LoadingIndicator } from './LoadingIndicator';

export interface ReportFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Callback to submit new event data */
  onSubmit: (data: NewEventData) => Promise<void>;
}

/**
 * ReportFormModal - Modal with form for reporting new events
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export function ReportFormModal({ isOpen, onClose, onSubmit }: ReportFormModalProps): JSX.Element | null {
  const [formData, setFormData] = React.useState<NewEventData>({
    cidade: '',
    uf: '',
    local: '',
    observacao: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof NewEventData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ cidade: '', uf: '', local: '', observacao: '' });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [isOpen]);

  // Close modal on ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validate field on change
  const validateField = (field: keyof NewEventData, value: string) => {
    let result;
    
    switch (field) {
      case 'cidade':
        result = validateCidade(value);
        break;
      case 'uf':
        result = validateUF(value);
        break;
      case 'local':
        result = validateLocal(value);
        break;
      case 'observacao':
        result = validateObservacao(value);
        break;
    }

    if (!result.isValid) {
      setErrors((prev) => ({ ...prev, [field]: result.error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle field change
  const handleChange = (field: keyof NewEventData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    validateField('cidade', formData.cidade);
    validateField('uf', formData.uf);
    validateField('local', formData.local);
    validateField('observacao', formData.observacao);

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0 ||
      !formData.cidade || !formData.uf || !formData.local || !formData.observacao;

    if (hasErrors) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      await onSubmit(formData);
      
      setSubmitSuccess(true);
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao reportar evento';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={(e) => {
        // Close on overlay click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h2 id="modal-title" className="text-2xl font-bold">
            Reportar Novo Evento
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-700 font-semibold">
                ✓ Evento reportado com sucesso!
              </p>
            </div>
          ) : null}

          {submitError ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700 font-semibold">
                ✗ {submitError}
              </p>
            </div>
          ) : null}

          {isSubmitting ? (
            <LoadingIndicator message="Enviando evento..." size="medium" />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cidade field */}
              <div>
                <label htmlFor="cidade" className="block text-sm font-semibold text-gray-700 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: São Paulo"
                  aria-invalid={!!errors.cidade}
                  aria-describedby={errors.cidade ? 'cidade-error' : undefined}
                />
                {errors.cidade && (
                  <p id="cidade-error" className="mt-1 text-sm text-red-600">
                    {errors.cidade}
                  </p>
                )}
              </div>

              {/* UF field */}
              <div>
                <label htmlFor="uf" className="block text-sm font-semibold text-gray-700 mb-1">
                  UF *
                </label>
                <input
                  type="text"
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => handleChange('uf', e.target.value.toUpperCase())}
                  maxLength={2}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase ${
                    errors.uf ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: SP"
                  aria-invalid={!!errors.uf}
                  aria-describedby={errors.uf ? 'uf-error' : undefined}
                />
                {errors.uf && (
                  <p id="uf-error" className="mt-1 text-sm text-red-600">
                    {errors.uf}
                  </p>
                )}
              </div>

              {/* Local field */}
              <div>
                <label htmlFor="local" className="block text-sm font-semibold text-gray-700 mb-1">
                  Local *
                </label>
                <input
                  type="text"
                  id="local"
                  value={formData.local}
                  onChange={(e) => handleChange('local', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.local ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Rodovia BR-101, km 250"
                  aria-invalid={!!errors.local}
                  aria-describedby={errors.local ? 'local-error' : undefined}
                />
                {errors.local && (
                  <p id="local-error" className="mt-1 text-sm text-red-600">
                    {errors.local}
                  </p>
                )}
              </div>

              {/* Observacao field */}
              <div>
                <label htmlFor="observacao" className="block text-sm font-semibold text-gray-700 mb-1">
                  Observação *
                </label>
                <textarea
                  id="observacao"
                  value={formData.observacao}
                  onChange={(e) => handleChange('observacao', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.observacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o evento em detalhes..."
                  aria-invalid={!!errors.observacao}
                  aria-describedby={errors.observacao ? 'observacao-error' : undefined}
                />
                {errors.observacao && (
                  <p id="observacao-error" className="mt-1 text-sm text-red-600">
                    {errors.observacao}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={Object.keys(errors).length > 0 || !formData.cidade || !formData.uf || !formData.local || !formData.observacao}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Reportar Evento
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
