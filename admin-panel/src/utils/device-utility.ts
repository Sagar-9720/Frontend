// Device Utility - Handles device detection and responsive utilities
import { BREAKPOINTS } from './constants';

export class DeviceUtility {
  private static instance: DeviceUtility;
  private mediaQueries: Map<string, MediaQueryList> = new Map();

  private constructor() {
    this.initializeMediaQueries();
  }

  public static getInstance(): DeviceUtility {
    if (!DeviceUtility.instance) {
      DeviceUtility.instance = new DeviceUtility();
    }
    return DeviceUtility.instance;
  }

  private initializeMediaQueries(): void {
    if (typeof window !== 'undefined') {
      Object.entries(BREAKPOINTS).forEach(([key, value]) => {
        const mediaQuery = window.matchMedia(`(min-width: ${value})`);
        this.mediaQueries.set(key.toLowerCase(), mediaQuery);
      });
    }
  }

  // Device type detection
  public isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < parseInt(BREAKPOINTS.MD);
  }

  public isTablet(): boolean {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= parseInt(BREAKPOINTS.MD) && width < parseInt(BREAKPOINTS.LG);
  }

  public isDesktop(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= parseInt(BREAKPOINTS.LG);
  }

  public isLargeDesktop(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= parseInt(BREAKPOINTS.XL);
  }

  // Screen size checks
  public isSmallScreen(): boolean {
    return this.getMediaQuery('sm')?.matches || false;
  }

  public isMediumScreen(): boolean {
    return this.getMediaQuery('md')?.matches || false;
  }

  public isLargeScreen(): boolean {
    return this.getMediaQuery('lg')?.matches || false;
  }

  public isExtraLargeScreen(): boolean {
    return this.getMediaQuery('xl')?.matches || false;
  }

  // Get media query
  public getMediaQuery(breakpoint: string): MediaQueryList | undefined {
    return this.mediaQueries.get(breakpoint.toLowerCase());
  }

  // Device orientation
  public isPortrait(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth;
  }

  public isLandscape(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  }

  // Touch device detection
  public isTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // Operating system detection
  public getOperatingSystem(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    
    if (/Mac/.test(platform)) return 'macOS';
    if (/Win/.test(platform)) return 'Windows';
    if (/Linux/.test(platform)) return 'Linux';
    if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
    if (/Android/.test(userAgent)) return 'Android';
    
    return 'unknown';
  }

  // Browser detection
  public getBrowser(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const userAgent = window.navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'unknown';
  }

  // Screen dimensions
  public getScreenDimensions(): { width: number; height: number } {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  public getViewportDimensions(): { width: number; height: number } {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    
    return {
      width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
  }

  // Device pixel ratio
  public getPixelRatio(): number {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }

  // Network information (if available)
  public getNetworkInfo(): any {
    if (typeof window === 'undefined' || !('navigator' in window)) return null;
    
    const navigator = window.navigator as any;
    if ('connection' in navigator) {
      return {
        type: navigator.connection.type,
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    
    return null;
  }

  // Memory information (if available)
  public getMemoryInfo(): any {
    if (typeof window === 'undefined' || !('navigator' in window)) return null;
    
    const navigator = window.navigator as any;
    if ('deviceMemory' in navigator) {
      return {
        deviceMemory: navigator.deviceMemory
      };
    }
    
    return null;
  }

  // Check if device supports specific features
  public supportsLocalStorage(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  public supportsSessionStorage(): boolean {
    try {
      const test = '__test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  public supportsWebGL(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  public supportsWebWorkers(): boolean {
    return typeof Worker !== 'undefined';
  }

  public supportsServiceWorkers(): boolean {
    return 'serviceWorker' in navigator;
  }

  // Responsive class helper
  public getResponsiveClasses(): string[] {
    const classes: string[] = [];
    
    if (this.isMobile()) classes.push('mobile');
    if (this.isTablet()) classes.push('tablet');
    if (this.isDesktop()) classes.push('desktop');
    if (this.isTouchDevice()) classes.push('touch');
    if (this.isPortrait()) classes.push('portrait');
    if (this.isLandscape()) classes.push('landscape');
    
    return classes;
  }

  // Add media query listener
  public addMediaQueryListener(
    breakpoint: string,
    callback: (matches: boolean) => void
  ): void {
    const mediaQuery = this.getMediaQuery(breakpoint);
    if (mediaQuery) {
      mediaQuery.addEventListener('change', (e) => callback(e.matches));
    }
  }

  // Remove media query listener
  public removeMediaQueryListener(
    breakpoint: string,
    callback: (matches: boolean) => void
  ): void {
    const mediaQuery = this.getMediaQuery(breakpoint);
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', (e) => callback(e.matches));
    }
  }
}

// Export singleton instance
export const deviceUtility = DeviceUtility.getInstance();

// Helper functions
export const isMobile = () => deviceUtility.isMobile();
export const isTablet = () => deviceUtility.isTablet();
export const isDesktop = () => deviceUtility.isDesktop();
export const isTouchDevice = () => deviceUtility.isTouchDevice();
export const getOperatingSystem = () => deviceUtility.getOperatingSystem();
export const getBrowser = () => deviceUtility.getBrowser();
