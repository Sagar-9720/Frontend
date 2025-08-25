// Default form object for role creation/editing
export const defaultRoleForm: CreateRolePayload = {
  name: '',
  description: ''
};
// Frontend Role model for admin panel - maps to backend API responses

export interface Role {
  roleId?: number;
  name: string;
  description?: string;
  createdAt?: string; // ISO datetime string from API
  updatedAt?: string; // ISO datetime string from API
}

// For creating new roles (form data)
export interface CreateRolePayload {
  name: string;
  description?: string;
}

// For updating existing roles (form data)
export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

// API response when fetching roles list
export interface RolesListResponse {
  roles: Role[];
  totalCount: number;
  page: number;
  limit: number;
}

// API response for single role
export interface RoleResponse {
  role: Role;
  message?: string;
}

// For dropdown/select options
export interface RoleOption {
  value: number;
  label: string;
  description?: string;
}

// Common role names used in the system
export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SUBADMIN: 'SUBADMIN'
} as const;

export type RoleNameType = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];
