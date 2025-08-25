// Storage Utility - Handles localStorage, sessionStorage, and cookies
import { STORAGE_KEYS } from './constants';

export interface StorageOptions {
  encrypt?: boolean;
  expiresIn?: number; // seconds
  prefix?: string;
}

export class StorageUtility {
  private static instance: StorageUtility;
  private prefix: string = 'travelmate_';

  private constructor() {}

  public static getInstance(): StorageUtility {
    if (!StorageUtility.instance) {
      StorageUtility.instance = new StorageUtility();
    }
    return StorageUtility.instance;
  }

  // LocalStorage methods
  public setItem(key: string, value: any, options: StorageOptions = {}): void {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const data = this.prepareData(value, options);
      localStorage.setItem(prefixedKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  public getItem<T = any>(key: string, options: StorageOptions = {}): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const stored = localStorage.getItem(prefixedKey);
      
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.removeItem(key, options);
        return null;
      }
      
      return this.extractValue(data, options);
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  public removeItem(key: string, options: StorageOptions = {}): void {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  public clear(prefix?: string): void {
    try {
      const targetPrefix = prefix || this.prefix;
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(targetPrefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // SessionStorage methods
  public setSessionItem(key: string, value: any, options: StorageOptions = {}): void {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const data = this.prepareData(value, options);
      sessionStorage.setItem(prefixedKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
    }
  }

  public getSessionItem<T = any>(key: string, options: StorageOptions = {}): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      const stored = sessionStorage.getItem(prefixedKey);
      
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.removeSessionItem(key, options);
        return null;
      }
      
      return this.extractValue(data, options);
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return null;
    }
  }

  public removeSessionItem(key: string, options: StorageOptions = {}): void {
    try {
      const prefixedKey = this.getPrefixedKey(key, options.prefix);
      sessionStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
    }
  }

  public clearSession(prefix?: string): void {
    try {
      const targetPrefix = prefix || this.prefix;
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(targetPrefix)
      );
      keys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  // Cookie methods
  public setCookie(
    name: string, 
    value: any, 
    options: {
      expires?: number; // days
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      httpOnly?: boolean;
    } = {}
  ): void {
    try {
      const {
        expires = 7,
        path = '/',
        domain,
        secure = window.location.protocol === 'https:',
        sameSite = 'lax'
      } = options;

      let cookieString = `${name}=${encodeURIComponent(JSON.stringify(value))}`;
      
      if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      }
      
      cookieString += `; path=${path}`;
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      if (secure) {
        cookieString += '; secure';
      }
      
      cookieString += `; samesite=${sameSite}`;
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  public getCookie<T = any>(name: string): T | null {
    try {
      const value = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
      
      if (!value) return null;
      
      return JSON.parse(decodeURIComponent(value));
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  public removeCookie(
    name: string, 
    options: { path?: string; domain?: string } = {}
  ): void {
    try {
      const { path = '/', domain } = options;
      let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }

  // Utility methods
  public isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  public getStorageUsage(): {
    localStorage: { used: number; available: number };
    sessionStorage: { used: number; available: number };
  } {
    const getUsage = (storage: Storage): { used: number; available: number } => {
      let used = 0;
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          used += storage[key].length + key.length;
        }
      }
      
      // Estimate available space (5MB limit for most browsers)
      const available = 5 * 1024 * 1024 - used;
      
      return { used, available };
    };

    return {
      localStorage: getUsage(localStorage),
      sessionStorage: getUsage(sessionStorage)
    };
  }

  public getAllKeys(prefix?: string): string[] {
    const targetPrefix = prefix || this.prefix;
    return Object.keys(localStorage).filter(key => 
      key.startsWith(targetPrefix)
    ).map(key => key.replace(targetPrefix, ''));
  }

  public exportData(keys?: string[]): Record<string, any> {
    const data: Record<string, any> = {};
    const targetKeys = keys || this.getAllKeys();
    
    targetKeys.forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    });
    
    return data;
  }

  public importData(data: Record<string, any>, overwrite: boolean = false): void {
    Object.entries(data).forEach(([key, value]) => {
      if (overwrite || this.getItem(key) === null) {
        this.setItem(key, value);
      }
    });
  }

  // Auth-specific methods
  public setAuthToken(token: string, expiresIn?: number): void {
    this.setItem(STORAGE_KEYS.AUTH_TOKEN, token, { expiresIn });
  }

  public getAuthToken(): string | null {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  public removeAuthToken(): void {
    this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  public setRefreshToken(token: string, expiresIn?: number): void {
    this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token, { expiresIn });
  }

  public getRefreshToken(): string | null {
    return this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  public removeRefreshToken(): void {
    this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  public setUserData(userData: any): void {
    this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }

  public getUserData<T = any>(): T | null {
    return this.getItem(STORAGE_KEYS.USER_DATA);
  }

  public removeUserData(): void {
    this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  public clearAuthData(): void {
    this.removeAuthToken();
    this.removeRefreshToken();
    this.removeUserData();
  }

  // Theme and preferences
  public setTheme(theme: string): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  public getTheme(): string | null {
    return this.getItem(STORAGE_KEYS.THEME);
  }

  public setPreferences(preferences: any): void {
    this.setItem(STORAGE_KEYS.PREFERENCES, preferences);
  }

  public getPreferences<T = any>(): T | null {
    return this.getItem(STORAGE_KEYS.PREFERENCES);
  }

  // Private helper methods
  private getPrefixedKey(key: string, prefix?: string): string {
    const targetPrefix = prefix || this.prefix;
    return `${targetPrefix}${key}`;
  }

  private prepareData(value: any, options: StorageOptions): any {
    const data: any = {
      value: options.encrypt ? this.encrypt(value) : value,
      timestamp: Date.now()
    };

    if (options.expiresIn) {
      data.expiresAt = Date.now() + (options.expiresIn * 1000);
    }

    return data;
  }

  private extractValue(data: any, options: StorageOptions): any {
    return options.encrypt ? this.decrypt(data.value) : data.value;
  }

  private encrypt(value: any): string {
    // Simple base64 encoding (replace with proper encryption in production)
    try {
      return btoa(JSON.stringify(value));
    } catch {
      return JSON.stringify(value);
    }
  }

  private decrypt(encryptedValue: string): any {
    // Simple base64 decoding (replace with proper decryption in production)
    try {
      return JSON.parse(atob(encryptedValue));
    } catch {
      return encryptedValue;
    }
  }
}

// Export singleton instance
export const storageUtility = StorageUtility.getInstance();

// Helper functions
export const setItem = (key: string, value: any, options?: StorageOptions) => 
  storageUtility.setItem(key, value, options);

export const getItem = <T = any>(key: string, options?: StorageOptions) => 
  storageUtility.getItem<T>(key, options);

export const removeItem = (key: string, options?: StorageOptions) => 
  storageUtility.removeItem(key, options);

export const setAuthToken = (token: string, expiresIn?: number) => 
  storageUtility.setAuthToken(token, expiresIn);

export const getAuthToken = () => 
  storageUtility.getAuthToken();

export const clearAuthData = () => 
  storageUtility.clearAuthData();
