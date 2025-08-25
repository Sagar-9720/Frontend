# Model-Based Data Sharing Architecture

## Overview

This document demonstrates the implementation of a model-based data sharing architecture in the admin panel frontend. The architecture provides type-safe, centralized data management using TypeScript models, services, and state management patterns.

## Architecture Components

### 1. Models (`src/models/`)

**Purpose**: Define TypeScript interfaces and types for data structures

**Example: Role Model** (`src/models/Role.ts`)
```typescript
// Core Role interface
export interface Role {
  roleId?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Form payload interfaces
export interface CreateRolePayload {
  name: string;
  description?: string;
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
}

// API response interfaces
export interface RolesListResponse {
  roles: Role[];
  total?: number;
  page?: number;
  limit?: number;
}
```

**Benefits**:
- Type safety across the application
- Clear data contracts between components
- IDE autocomplete and error detection
- Self-documenting code structure

### 2. Services (`src/services/`)

**Purpose**: Handle API communication using models for type safety

**Example: Role Service** (`src/services/roleService.ts`)
```typescript
class RoleService {
  async getRoles(): Promise<RolesListResponse> {
    const response = await httpClient.get(API_ENDPOINTS.USER.ROLES);
    return response.data;
  }

  async createRole(data: CreateRolePayload): Promise<Role> {
    const response = await httpClient.post(API_ENDPOINTS.USER.ROLES, data);
    return response.data;
  }

  async updateRole(id: string, data: UpdateRolePayload): Promise<Role> {
    const endpoint = replaceUrlParams(API_ENDPOINTS.USER.ROLE_BY_ID, { id });
    const response = await httpClient.put(endpoint, data);
    return response.data;
  }
}
```

**Benefits**:
- Centralized API logic
- Type-safe request/response handling
- Consistent error handling
- Easy mocking for testing

### 3. Data Manager (`src/utils/roleDataManager.ts`)

**Purpose**: Centralized state management with model-based data sharing

**Key Features**:
- Singleton pattern for global state
- Observer pattern for reactive updates
- Optimistic updates for better UX
- Built-in search and filtering
- Statistics computation

```typescript
export class RoleDataManager {
  private static instance: RoleDataManager;
  private roles: Role[] = [];
  private listeners: ((roles: Role[]) => void)[] = [];

  // Subscribe to data changes
  subscribe(listener: (roles: Role[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Search using model data
  searchRoles(searchTerm: string): Role[] {
    if (!searchTerm.trim()) return this.getRoles();
    
    const term = searchTerm.toLowerCase();
    return this.roles.filter(role => 
      role.name.toLowerCase().includes(term) ||
      (role.description && role.description.toLowerCase().includes(term))
    );
  }
}
```

### 4. React Hook Integration

**Purpose**: React integration for the data manager

```typescript
export const useRoleData = () => {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const dataManager = RoleDataManager.getInstance();

  React.useEffect(() => {
    const unsubscribe = dataManager.subscribe((updatedRoles) => {
      setRoles(updatedRoles);
      setIsLoading(dataManager.getIsLoading());
    });

    return unsubscribe;
  }, [dataManager]);

  return {
    roles,
    isLoading,
    refreshRoles: () => dataManager.fetchRoles(),
    searchRoles: (term: string) => dataManager.searchRoles(term),
    getRoleStats: () => dataManager.getRoleStats()
  };
};
```

## Implementation Examples

### 1. Basic Implementation (`src/pages/Roles.tsx`)

Shows how to refactor existing components to use model-based architecture:

- Import models instead of basic types
- Use typed service responses
- Implement proper error handling
- Enhance UI with model-aware features

### 2. Enhanced Implementation (`src/pages/RolesEnhanced.tsx`)

Demonstrates advanced features using the data manager:

- Centralized state management
- Real-time data synchronization
- Optimistic updates
- Built-in search and filtering
- Statistics computation
- Performance optimization

## Benefits of Model-Based Architecture

### 1. Type Safety
- Compile-time error detection
- IDE autocomplete and IntelliSense
- Reduced runtime errors
- Self-documenting interfaces

### 2. Data Consistency
- Single source of truth
- Automatic synchronization across components
- Optimistic updates with rollback capability
- Centralized validation logic

### 3. Maintainability
- Clear separation of concerns
- Reusable data logic
- Easy to test and mock
- Consistent patterns across features

### 4. Performance
- Efficient data sharing
- Reduced API calls
- Smart caching strategies
- Optimized re-renders

### 5. Developer Experience
- Clear data flow
- Predictable state management
- Easy debugging
- Consistent API patterns

## Usage Patterns

### 1. Component Integration
```typescript
const MyComponent: React.FC = () => {
  const { roles, isLoading, refreshRoles } = useRoleData();
  
  // Component automatically receives updates when data changes
  return (
    <div>
      {isLoading ? 'Loading...' : `Found ${roles.length} roles`}
    </div>
  );
};
```

### 2. Data Operations
```typescript
const handleCreateRole = async (formData: CreateRolePayload) => {
  try {
    // API call with type safety
    const newRole = await roleService.createRole(formData);
    
    // Optimistic update
    await dataManager.addRole(newRole);
    
    // All subscribed components automatically update
  } catch (error) {
    // Error handling and rollback if needed
    await dataManager.fetchRoles();
  }
};
```

### 3. Search and Filtering
```typescript
const SearchComponent: React.FC = () => {
  const { searchRoles } = useRoleData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRoles = useMemo(() => 
    searchRoles(searchTerm), 
    [searchRoles, searchTerm]
  );
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search roles..."
    />
  );
};
```

## Extension to Other Features

This pattern can be extended to other admin panel features:

### 1. User Management
- Create `User` model with proper interfaces
- Implement `UserService` with typed methods
- Build `UserDataManager` for state management
- Use `useUserData` hook in components

### 2. Permission Management
- Define `Permission` model with role relationships
- Create specialized services for permission operations
- Implement complex filtering and search logic
- Add real-time permission updates

### 3. Analytics Dashboard
- Aggregate data from multiple models
- Create specialized hooks for dashboard metrics
- Implement real-time data updates
- Cache expensive computations

## Best Practices

### 1. Model Design
- Keep interfaces focused and cohesive
- Use optional properties wisely
- Define clear payload types for operations
- Include metadata when needed

### 2. Service Implementation
- Use consistent naming conventions
- Handle errors appropriately
- Include proper logging
- Support pagination and filtering

### 3. State Management
- Implement optimistic updates carefully
- Provide rollback mechanisms
- Use efficient update patterns
- Clean up resources properly

### 4. Component Integration
- Use hooks for data access
- Implement loading states
- Handle errors gracefully
- Optimize re-renders with useMemo/useCallback

## Testing Strategy

### 1. Model Testing
- Validate type definitions
- Test serialization/deserialization
- Ensure backwards compatibility

### 2. Service Testing
- Mock API responses
- Test error scenarios
- Validate request formatting

### 3. Data Manager Testing
- Test state transitions
- Verify subscription behavior
- Check optimistic updates

### 4. Component Testing
- Mock data dependencies
- Test loading states
- Verify user interactions

This architecture provides a solid foundation for scalable, maintainable frontend applications with excellent developer experience and type safety.
