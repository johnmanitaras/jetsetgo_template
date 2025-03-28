# JetSetGo Application

## Permissions System

The application includes a robust permissions system for managing access control throughout the application. This guide explains how to implement and use the permissions features.

### Core Components

#### 1. Permission Guard
The `PermissionGuard` component provides route-level protection:

```tsx
import { PermissionGuard } from '../components/common/PermissionGuard';

function SecurePage() {
  return (
    <PermissionGuard permission="view:reports">
      <div>Protected content...</div>
    </PermissionGuard>
  );
}
```

#### 2. Permissions Hook
The `usePermissions` hook provides methods for checking permissions:

```tsx
import { usePermissions } from '../utils/permissions';

function MyComponent() {
  const { can, hasAny, hasAll } = usePermissions();

  // Check single permission
  if (can('manage:users')) {
    // User has permission...
  }

  // Check if user has any of the permissions
  if (hasAny(['edit:reports', 'view:reports'])) {
    // User has at least one permission...
  }

  // Check if user has all permissions
  if (hasAll(['view:reports', 'edit:reports'])) {
    // User has all permissions...
  }
}
```

### Common Use Cases

#### 1. Protecting Routes
```tsx
// In your router configuration
<Route
  path="/reports"
  element={
    <PrivateRoute>
      <PermissionGuard permission="view:reports">
        <ReportsPage />
      </PermissionGuard>
    </PrivateRoute>
  }
/>
```

#### 2. Conditional Button Rendering
```tsx
function ActionButton() {
  const { can } = usePermissions();
  
  if (!can('manage:users')) {
    return null;
  }
  
  return <button>Manage Users</button>;
}
```

#### 3. Handling Unauthorized Actions
```tsx
function ManageUsersButton() {
  const { can } = usePermissions();
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    if (!can('manage:users')) {
      setShowToast(true);
      return;
    }
    // Proceed with action...
  };

  return (
    <>
      <button onClick={handleClick}>Manage Users</button>
      <Toast
        message="You don't have permission to manage users."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
```

### Best Practices

1. **Always Check Permissions Server-Side**
   - Client-side permissions are for UI purposes only
   - Implement proper server-side authorization checks

2. **Use Specific Permissions**
   - Create granular permissions (e.g., `view:reports`, `edit:reports`)
   - Avoid broad permissions like `admin`

3. **Handle Permission Denied Gracefully**
   - Use the `AccessDenied` component for page-level access
   - Use the `Toast` component for action-level permissions
   - Provide clear feedback to users

4. **Combine with Authentication**
   - Always wrap permission checks inside authenticated routes
   - Use `PrivateRoute` before `PermissionGuard`

### Available Permissions

Common permissions used in the application:

- `view:dashboard` - Access to main dashboard
- `manage:users` - User management capabilities
- `manage:groups` - Group management capabilities
- `view:reports` - View reports
- `edit:reports` - Edit reports
- `saveblueprint` - Save blueprint configurations
- `managepermissions` - Manage user permissions

### Error Handling

The system includes built-in error handling:

1. **Page Access Denied**
   - Shows a friendly error page
   - Provides a "Go Back" button
   - Automatically handles navigation

2. **Action Access Denied**
   - Shows a toast notification
   - Auto-dismisses after 5 seconds
   - Provides clear feedback

### TypeScript Support

The permissions system is fully typed:

```tsx
interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
}

interface UsePermissionsReturn {
  can: (permission: string) => boolean;
  hasAny: (permissions: string[]) => boolean;
  hasAll: (permissions: string[]) => boolean;
}
```

### Testing Permissions

When testing components that use permissions:

```tsx
import { usePermissions } from '../utils/permissions';

jest.mock('../utils/permissions', () => ({
  usePermissions: jest.fn()
}));

describe('MyComponent', () => {
  it('shows content when user has permission', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      can: () => true
    });
    // Test component...
  });

  it('hides content when user lacks permission', () => {
    (usePermissions as jest.Mock).mockReturnValue({
      can: () => false
    });
    // Test component...
  });
});
```