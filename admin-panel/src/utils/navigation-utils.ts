// Navigation Utilities - Helper functions for routing and navigation
import { NAVIGATION_STRINGS } from './constants';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  requiredPermissions?: string[];
  isActive?: boolean;
  isExpanded?: boolean;
  badge?: string | number;
  isExternal?: boolean;
  target?: '_blank' | '_self';
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export class NavigationUtils {
  private static instance: NavigationUtils;
  private currentPath: string = '';
  private navigationHistory: string[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      this.currentPath = window.location.pathname;
      this.initializeHistoryListener();
    }
  }

  public static getInstance(): NavigationUtils {
    if (!NavigationUtils.instance) {
      NavigationUtils.instance = new NavigationUtils();
    }
    return NavigationUtils.instance;
  }

  private initializeHistoryListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.currentPath = window.location.pathname;
      });
    }
  }

  // Get navigation items
  public getNavigationItems(): NavigationItem[] {
    return [
      {
        id: 'dashboard',
        label: NAVIGATION_STRINGS.DASHBOARD,
        path: '/dashboard',
        icon: 'LayoutDashboard'
      },
      {
        id: 'users',
        label: NAVIGATION_STRINGS.USERS,
        path: '/users',
        icon: 'Users'
      },
      {
        id: 'roles',
        label: NAVIGATION_STRINGS.ROLES,
        path: '/roles',
        icon: 'Shield'
      },
      {
        id: 'destinations',
        label: NAVIGATION_STRINGS.DESTINATIONS,
        path: '/destinations',
        icon: 'MapPin'
      },
      {
        id: 'regions',
        label: NAVIGATION_STRINGS.REGIONS,
        path: '/regions',
        icon: 'Globe'
      },
      {
        id: 'trips',
        label: NAVIGATION_STRINGS.TRIPS,
        path: '/trips',
        icon: 'Plane'
      },
      {
        id: 'itineraries',
        label: NAVIGATION_STRINGS.ITINERARIES,
        path: '/itineraries',
        icon: 'Route'
      },
      {
        id: 'travel-journals',
        label: NAVIGATION_STRINGS.TRAVEL_JOURNALS,
        path: '/travel-journals',
        icon: 'BookOpen'
      },
      {
        id: 'sub-admins',
        label: NAVIGATION_STRINGS.SUB_ADMINS,
        path: '/sub-admins',
        icon: 'UserCog'
      },
      {
        id: 'settings',
        label: NAVIGATION_STRINGS.SETTINGS,
        path: '/settings',
        icon: 'Settings'
      }
    ];
  }

  // Check if path is active
  public isPathActive(path: string, exact: boolean = false): boolean {
    if (exact) {
      return this.currentPath === path;
    }
    return this.currentPath.startsWith(path);
  }

  // Get active navigation item
  public getActiveNavigationItem(): NavigationItem | null {
    const items = this.getNavigationItems();
    return this.findActiveItem(items) || null;
  }

  private findActiveItem(items: NavigationItem[]): NavigationItem | undefined {
    for (const item of items) {
      if (this.isPathActive(item.path, true)) {
        return item;
      }
      if (item.children) {
        const activeChild = this.findActiveItem(item.children);
        if (activeChild) {
          return activeChild;
        }
      }
    }
    return undefined;
  }

  // Generate breadcrumbs
  public generateBreadcrumbs(currentPath?: string): BreadcrumbItem[] {
    const path = currentPath || this.currentPath;
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/dashboard' }
    ];

    let currentSegmentPath = '';
    const navigationItems = this.getNavigationItems();

    segments.forEach((segment, index) => {
      currentSegmentPath += `/${segment}`;
      const item = this.findNavigationItemByPath(navigationItems, currentSegmentPath);
      
      if (item) {
        breadcrumbs.push({
          label: item.label,
          path: currentSegmentPath,
          isActive: index === segments.length - 1
        });
      } else {
        // Fallback for dynamic routes
        breadcrumbs.push({
          label: this.formatSegmentLabel(segment),
          path: currentSegmentPath,
          isActive: index === segments.length - 1
        });
      }
    });

    return breadcrumbs;
  }

  private findNavigationItemByPath(items: NavigationItem[], path: string): NavigationItem | undefined {
    for (const item of items) {
      if (item.path === path) {
        return item;
      }
      if (item.children) {
        const found = this.findNavigationItemByPath(item.children, path);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  private formatSegmentLabel(segment: string): string {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // URL utilities
  public buildUrl(path: string, params?: Record<string, any>): string {
    let url = path;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  public parseUrlParams(url?: string): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    const searchParams = new URLSearchParams(
      url ? new URL(url).search : window.location.search
    );
    
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  }

  // History management
  public addToHistory(path: string): void {
    this.navigationHistory.push(path);
    // Keep only last 10 items
    if (this.navigationHistory.length > 10) {
      this.navigationHistory = this.navigationHistory.slice(-10);
    }
  }

  public getNavigationHistory(): string[] {
    return [...this.navigationHistory];
  }

  public getPreviousPath(): string | null {
    return this.navigationHistory.length > 1 
      ? this.navigationHistory[this.navigationHistory.length - 2] 
      : null;
  }

  // Route validation
  public isValidRoute(path: string): boolean {
    const navigationItems = this.getNavigationItems();
    return this.findNavigationItemByPath(navigationItems, path) !== undefined;
  }

  // External link detection
  public isExternalLink(url: string): boolean {
    try {
      const link = new URL(url);
      const current = new URL(window.location.href);
      return link.hostname !== current.hostname;
    } catch {
      return false;
    }
  }

  // Deep link utilities
  public createDeepLink(path: string, params?: Record<string, any>): string {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : '';
    
    return baseUrl + this.buildUrl(path, params);
  }

  // Navigation guard utilities
  public canNavigateToPath(path: string, userPermissions: string[]): boolean {
    const navigationItems = this.getNavigationItems();
    const item = this.findNavigationItemByPath(navigationItems, path);
    
    if (!item || !item.requiredPermissions) {
      return true;
    }
    
    return item.requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
  }

  // Search navigation items
  public searchNavigationItems(query: string): NavigationItem[] {
    const allItems = this.getAllNavigationItems();
    const lowercaseQuery = query.toLowerCase();
    
    return allItems.filter(item =>
      item.label.toLowerCase().includes(lowercaseQuery) ||
      item.path.toLowerCase().includes(lowercaseQuery)
    );
  }

  private getAllNavigationItems(): NavigationItem[] {
    const items: NavigationItem[] = [];
    const navigationItems = this.getNavigationItems();
    
    const flatten = (navItems: NavigationItem[]) => {
      navItems.forEach(item => {
        items.push(item);
        if (item.children) {
          flatten(item.children);
        }
      });
    };
    
    flatten(navigationItems);
    return items;
  }

  // Update current path (for manual updates)
  public updateCurrentPath(path: string): void {
    this.currentPath = path;
    this.addToHistory(path);
  }

  // Get current path
  public getCurrentPath(): string {
    return this.currentPath;
  }
}

// Export singleton instance
export const navigationUtils = NavigationUtils.getInstance();

// Helper functions
export const isPathActive = (path: string, exact?: boolean) => 
  navigationUtils.isPathActive(path, exact);

export const generateBreadcrumbs = (currentPath?: string) => 
  navigationUtils.generateBreadcrumbs(currentPath);

export const buildUrl = (path: string, params?: Record<string, any>) => 
  navigationUtils.buildUrl(path, params);

export const parseUrlParams = (url?: string) => 
  navigationUtils.parseUrlParams(url);

export const isExternalLink = (url: string) => 
  navigationUtils.isExternalLink(url);
