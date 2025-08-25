// Helper Functions - General utility functions
import { format, parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Date and Time Helpers
export const dateHelpers = {
  // Format date with predefined formats
  format: (date: string | Date, formatKey: keyof typeof DATE_FORMATS = 'DISPLAY'): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';
      return format(dateObj, DATE_FORMATS[formatKey]);
    } catch {
      return 'Invalid Date';
    }
  },

  // Get relative time (e.g., "2 hours ago")
  relative: (date: string | Date): string => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Invalid Date';
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return 'Invalid Date';
    }
  },

  // Check if date is today
  isToday: (date: string | Date): boolean => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      const today = new Date();
      return dateObj.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  },

  // Check if date is in the past
  isPast: (date: string | Date): boolean => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return dateObj < new Date();
    } catch {
      return false;
    }
  },

  // Check if date is in the future
  isFuture: (date: string | Date): boolean => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return dateObj > new Date();
    } catch {
      return false;
    }
  },

  // Get days between two dates
  daysBetween: (startDate: string | Date, endDate: string | Date): number => {
    try {
      const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
      const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  },

  // Add days to a date
  addDays: (date: string | Date, days: number): Date => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
  },

  // Get start of day
  startOfDay: (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
  },

  // Get end of day
  endOfDay: (date: string | Date): Date => {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
  }
};

// String Helpers
export const stringHelpers = {
  // Capitalize first letter
  capitalize: (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Convert to title case
  titleCase: (str: string): string => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Convert to kebab case
  kebabCase: (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  },

  // Convert to camel case
  camelCase: (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },

  // Convert to snake case
  snakeCase: (str: string): string => {
    return str
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  },

  // Truncate string
  truncate: (str: string, maxLength: number, suffix: string = '...'): string => {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  },

  // Remove special characters
  sanitize: (str: string): string => {
    return str.replace(/[^\w\s-]/gi, '');
  },

  // Extract initials
  initials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  },

  // Generate slug
  slug: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Count words
  wordCount: (str: string): number => {
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  },

  // Escape HTML
  escapeHtml: (str: string): string => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Generate random string
  random: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Number Helpers
export const numberHelpers = {
  // Format currency
  currency: (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  },

  // Format percentage
  percentage: (value: number, decimals: number = 2): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  // Format large numbers (1K, 1M, etc.)
  compact: (num: number): string => {
    const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num);
  },

  // Round to decimal places
  round: (num: number, decimals: number = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  // Clamp number between min and max
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  },

  // Generate random number in range
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Check if number is even
  isEven: (num: number): boolean => {
    return num % 2 === 0;
  },

  // Check if number is odd
  isOdd: (num: number): boolean => {
    return num % 2 !== 0;
  },

  // Convert bytes to human readable format
  bytes: (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }
};

// Array Helpers
export const arrayHelpers = {
  // Remove duplicates
  unique: <T>(arr: T[]): T[] => {
    return [...new Set(arr)];
  },

  // Group array by key
  groupBy: <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Sort array by key
  sortBy: <T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Chunk array into smaller arrays
  chunk: <T>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Shuffle array
  shuffle: <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Find intersection of arrays
  intersection: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => arr2.includes(item));
  },

  // Find difference between arrays
  difference: <T>(arr1: T[], arr2: T[]): T[] => {
    return arr1.filter(item => !arr2.includes(item));
  },

  // Flatten nested array
  flatten: <T>(arr: (T | T[])[]): T[] => {
    const result: T[] = [];
    for (const item of arr) {
      if (Array.isArray(item)) {
        result.push(...arrayHelpers.flatten(item));
      } else {
        result.push(item);
      }
    }
    return result;
  },

  // Get random item from array
  random: <T>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Move item in array
  move: <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...arr];
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
  }
};

// Object Helpers
export const objectHelpers = {
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array) return obj.map(item => objectHelpers.deepClone(item)) as unknown as T;
    
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = objectHelpers.deepClone(obj[key]);
      }
    }
    return clonedObj;
  },

  // Deep merge objects
  deepMerge: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T => {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (objectHelpers.isObject(target) && objectHelpers.isObject(source)) {
      for (const key in source) {
        if (objectHelpers.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          if (source[key]) {
            objectHelpers.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    
    return objectHelpers.deepMerge(target, ...sources);
  },

  // Check if value is object
  isObject: (item: any): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
  },

  // Get nested property safely
  get: (obj: any, path: string, defaultValue?: any): any => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  },

  // Set nested property
  set: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    let current = obj;
    for (const key of keys) {
      if (!(key in current) || !objectHelpers.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[lastKey] = value;
  },

  // Pick properties from object
  pick: <T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  // Omit properties from object
  omit: <T extends Record<string, any>, K extends keyof T>(
    obj: T, 
    keys: K[]
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  // Check if objects are equal (deep comparison)
  isEqual: (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return obj1 === obj2;
    
    if (typeof obj1 !== typeof obj2) return false;
    
    if (typeof obj1 !== 'object') return obj1 === obj2;
    
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!objectHelpers.isEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  }
};

// URL Helpers
export const urlHelpers = {
  // Parse query string
  parseQuery: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  // Build query string
  buildQuery: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },

  // Join URL parts
  join: (...parts: string[]): string => {
    return parts
      .map((part, index) => {
        if (index === 0) {
          return part.replace(/\/+$/, '');
        }
        return part.replace(/^\/+|\/+$/g, '');
      })
      .filter(part => part)
      .join('/');
  },

  // Get domain from URL
  getDomain: (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  }
};

// Performance Helpers
export const performanceHelpers = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(null, args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Measure execution time
  measure: async <T>(name: string, fn: () => Promise<T> | T): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
};

// Export all helpers
export const helpers = {
  date: dateHelpers,
  string: stringHelpers,
  number: numberHelpers,
  array: arrayHelpers,
  object: objectHelpers,
  url: urlHelpers,
  performance: performanceHelpers
};
