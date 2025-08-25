// Validity Utility - Validation functions for forms and data
import { VALIDATION_RULES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  min?: number;
  max?: number;
  type?: 'string' | 'number' | 'email' | 'url' | 'phone' | 'password' | 'date' | 'array' | 'object';
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export class Validity {
  private static instance: Validity;

  private constructor() {}

  public static getInstance(): Validity {
    if (!Validity.instance) {
      Validity.instance = new Validity();
    }
    return Validity.instance;
  }

  // Core validation method
  public validate(value: any, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required validation
    if (rules.required && this.isEmpty(value)) {
      errors.push('This field is required');
      return { isValid: false, errors, warnings };
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value) && !rules.required) {
      return { isValid: true, errors, warnings };
    }

    // Type validation
    if (rules.type) {
      const typeValidation = this.validateType(value, rules.type);
      if (!typeValidation.isValid) {
        errors.push(...typeValidation.errors);
      }
    }

    // Length validation for strings
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`);
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`);
      }
    }

    // Numeric range validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`Minimum value is ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`Maximum value is ${rules.max}`);
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        errors.push('Invalid format');
      }
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push('Custom validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  // Validate object against schema
  public validateObject(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(schema).forEach(([field, rules]) => {
      const value = data[field];
      const result = this.validate(value, rules);
      
      if (!result.isValid) {
        result.errors.forEach(error => {
          errors.push(`${field}: ${error}`);
        });
      }
      
      if (result.warnings) {
        result.warnings.forEach(warning => {
          warnings.push(`${field}: ${warning}`);
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  // Type-specific validation methods
  public validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!VALIDATION_RULES.EMAIL.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return { isValid: errors.length === 0, errors };
  }

  public validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`);
    }

    if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // Password strength warnings
    if (password.length < 12) {
      warnings.push('Consider using a longer password for better security');
    }

    const commonPasswords = ['password', '123456', 'qwerty', 'abc123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Please choose a less common password');
    }

    return { 
      isValid: errors.length === 0, 
      errors, 
      warnings: warnings.length > 0 ? warnings : undefined 
    };
  }

  public validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      errors.push('Phone number is required');
    } else if (!VALIDATION_RULES.PHONE.test(phone)) {
      errors.push('Please enter a valid phone number');
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateUrl(url: string): ValidationResult {
    const errors: string[] = [];
    
    if (!url) {
      errors.push('URL is required');
    } else if (!VALIDATION_RULES.URL.test(url)) {
      errors.push('Please enter a valid URL');
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateDate(date: string | Date): ValidationResult {
    const errors: string[] = [];
    
    if (!date) {
      errors.push('Date is required');
    } else {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        errors.push('Please enter a valid date');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateDateRange(startDate: string | Date, endDate: string | Date): ValidationResult {
    const errors: string[] = [];
    
    const startValidation = this.validateDate(startDate);
    const endValidation = this.validateDate(endDate);
    
    if (!startValidation.isValid) {
      errors.push('Start date is invalid');
    }
    
    if (!endValidation.isValid) {
      errors.push('End date is invalid');
    }
    
    if (startValidation.isValid && endValidation.isValid) {
      const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
      const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
      
      if (start >= end) {
        errors.push('End date must be after start date');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    requiredExtensions?: string[];
  } = {}): ValidationResult {
    const errors: string[] = [];
    const { maxSize, allowedTypes, requiredExtensions } = options;
    
    if (!file) {
      errors.push('File is required');
      return { isValid: false, errors };
    }

    // Size validation
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    // Type validation
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Extension validation
    if (requiredExtensions) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !requiredExtensions.includes(fileExtension)) {
        errors.push(`File must have one of these extensions: ${requiredExtensions.join(', ')}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateCreditCard(cardNumber: string): ValidationResult {
    const errors: string[] = [];
    
    if (!cardNumber) {
      errors.push('Credit card number is required');
      return { isValid: false, errors };
    }

    // Remove spaces and hyphens
    const cleanNumber = cardNumber.replace(/[\s-]/g, '');
    
    // Check if all digits
    if (!/^\d+$/.test(cleanNumber)) {
      errors.push('Credit card number must contain only digits');
    }

    // Check length
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      errors.push('Credit card number must be between 13 and 19 digits');
    }

    // Luhn algorithm validation
    if (!this.luhnCheck(cleanNumber)) {
      errors.push('Invalid credit card number');
    }

    return { isValid: errors.length === 0, errors };
  }

  public validateZipCode(zipCode: string, country: string = 'US'): ValidationResult {
    const errors: string[] = [];
    
    if (!zipCode) {
      errors.push('ZIP code is required');
      return { isValid: false, errors };
    }

    const patterns: Record<string, RegExp> = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
      DE: /^\d{5}$/,
      FR: /^\d{5}$/
    };

    const pattern = patterns[country.toUpperCase()];
    if (pattern && !pattern.test(zipCode)) {
      errors.push(`Invalid ${country} ZIP/postal code format`);
    }

    return { isValid: errors.length === 0, errors };
  }

  // Utility methods
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  private validateType(value: any, type: string): ValidationResult {
    const errors: string[] = [];

    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push('Must be a string');
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push('Must be a valid number');
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !VALIDATION_RULES.EMAIL.test(value)) {
          errors.push('Must be a valid email address');
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !VALIDATION_RULES.URL.test(value)) {
          errors.push('Must be a valid URL');
        }
        break;
      case 'phone':
        if (typeof value !== 'string' || !VALIDATION_RULES.PHONE.test(value)) {
          errors.push('Must be a valid phone number');
        }
        break;
      case 'password':
        if (typeof value !== 'string' || !VALIDATION_RULES.PASSWORD.PATTERN.test(value)) {
          errors.push('Must be a valid password');
        }
        break;
      case 'date':
        const dateObj = new Date(value);
        if (isNaN(dateObj.getTime())) {
          errors.push('Must be a valid date');
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          errors.push('Must be an array');
        }
        break;
      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          errors.push('Must be an object');
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  }

  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Pre-built validation schemas
  public getUserValidationSchema(): ValidationSchema {
    return {
      firstName: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
      },
      lastName: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
      },
      email: {
        required: true,
        type: 'email'
      },
      password: {
        required: true,
        type: 'password'
      },
      phone: {
        required: false,
        type: 'phone'
      },
      dateOfBirth: {
        required: false,
        type: 'date'
      }
    };
  }

  public getDestinationValidationSchema(): ValidationSchema {
    return {
      name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 100
      },
      description: {
        required: true,
        type: 'string',
        minLength: 10,
        maxLength: 1000
      },
      country: {
        required: true,
        type: 'string'
      },
      city: {
        required: true,
        type: 'string'
      },
      latitude: {
        required: false,
        type: 'number',
        min: -90,
        max: 90
      },
      longitude: {
        required: false,
        type: 'number',
        min: -180,
        max: 180
      }
    };
  }

  public getTripValidationSchema(): ValidationSchema {
    return {
      title: {
        required: true,
        type: 'string',
        minLength: 5,
        maxLength: 100
      },
      description: {
        required: true,
        type: 'string',
        minLength: 20,
        maxLength: 2000
      },
      startDate: {
        required: true,
        type: 'date'
      },
      endDate: {
        required: true,
        type: 'date'
      },
      budget: {
        required: false,
        type: 'number',
        min: 0
      },
      maxParticipants: {
        required: false,
        type: 'number',
        min: 1,
        max: 100
      }
    };
  }
}

// Export singleton instance
export const validity = Validity.getInstance();

// Helper functions
export const validate = (value: any, rules: ValidationRule) => validity.validate(value, rules);
export const validateObject = (data: Record<string, any>, schema: ValidationSchema) => 
  validity.validateObject(data, schema);
export const validateEmail = (email: string) => validity.validateEmail(email);
export const validatePassword = (password: string) => validity.validatePassword(password);
export const validatePhone = (phone: string) => validity.validatePhone(phone);
export const validateFile = (file: File, options?: any) => validity.validateFile(file, options);
