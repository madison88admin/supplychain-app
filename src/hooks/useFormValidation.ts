import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormData {
  [key: string]: any;
}

export const useFormValidation = <T extends FormData>(
  initialData: T,
  validationRules: { [K in keyof T]?: ValidationRule }
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});

  const validateField = useCallback((field: keyof T, value: any): string | null => {
    const rules = validationRules[field];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${String(field)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Number validation
    if (rules.number && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }

    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `${String(field)} must be at least ${rules.minLength} characters long`;
    }

    // Max length validation
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `${String(field)} must be no more than ${rules.maxLength} characters long`;
    }

    // Min value validation
    if (rules.min !== undefined && Number(value) < rules.min) {
      return `${String(field)} must be at least ${rules.min}`;
    }

    // Max value validation
    if (rules.max !== undefined && Number(value) > rules.max) {
      return `${String(field)} must be no more than ${rules.max}`;
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return `${String(field)} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field as keyof T, data[field as keyof T]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [data, validateField, validationRules]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
    
    // Validate field when it's touched
    if (isTouched) {
      const error = validateField(field, data[field]);
      setErrors(prev => ({ ...prev, [field as string]: error || '' }));
    }
  }, [data, validateField]);

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const getFieldError = useCallback((field: keyof T): string | null => {
    return errors[field as string] || null;
  }, [errors]);

  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return touched[field] || false;
  }, [touched]);

  const hasErrors = Object.values(errors).some(error => error !== '');

  return {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateForm,
    validateField,
    resetForm,
    getFieldError,
    isFieldTouched,
    hasErrors,
    isValid: !hasErrors && Object.keys(touched).length > 0
  };
};

// Common validation rules
export const validationRules = {
  required: { required: true },
  email: { required: true, email: true },
  password: { 
    required: true, 
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
      return null;
    }
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    custom: (value: string) => {
      if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    }
  },
  positiveNumber: { number: true, min: 0 },
  percentage: { number: true, min: 0, max: 100 }
};
