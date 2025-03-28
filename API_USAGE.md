# API Usage Guide

## Overview

This application provides a centralized API client that handles authentication, custom headers, and error handling. The API client is implemented using the `useApi` hook, which ensures consistent header management and error handling across all API calls.

## Key Features

- Automatic tenant header management
- API key handling
- User ID header inclusion
- Consistent error handling
- Debug information for development
- Type-safe responses

## How to Make API Calls

### 1. Import the useApi Hook

```typescript
import { useApi } from '../hooks/useApi';
```

### 2. Use the Hook in Your Component

```typescript
function YourComponent() {
  const { fetchWithAuth } = useApi();

  const fetchData = async () => {
    try {
      const response = await fetchWithAuth('/your-endpoint');
      // Handle the response
    } catch (error) {
      // Handle any errors
    }
  };
}
```

### 3. Making Different Types of Requests

```typescript
// GET Request (default)
const getData = await fetchWithAuth('/endpoint');

// POST Request
const postData = await fetchWithAuth('/endpoint', {
  method: 'POST',
  body: JSON.stringify(payload)
});

// PUT Request
const putData = await fetchWithAuth('/endpoint', {
  method: 'PUT',
  body: JSON.stringify(payload)
});

// DELETE Request
const deleteData = await fetchWithAuth('/endpoint', {
  method: 'DELETE'
});
```

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse {
  data: any;  // The actual API response data
  debug: {
    url: string;  // The full URL that was called
    headers: Record<string, string>;  // Headers sent (sensitive data redacted)
  };
}
```

## ⚠️ Important Guidelines

1. **DO NOT** create your own fetch calls or axios instances. Always use the `useApi` hook.

2. **DO NOT** manually set these headers:
   - `X-DB-Name`
   - `x-api-key`
   - `user-id`
   These are automatically handled by the API client.

3. **DO NOT** store the API key in your components. It's managed centrally.

4. **ALWAYS** handle errors appropriately in your components.

## Error Handling

The API client includes built-in error handling. Errors will include both the error message and debug information:

```typescript
try {
  const response = await fetchWithAuth('/endpoint');
  // Handle success
} catch (error) {
  console.error('API Error:', error.message);
  console.debug('Debug Info:', error.debug);
}
```

## Example Usage

### Basic Data Fetching

```typescript
function UserProfile() {
  const { fetchWithAuth } = useApi();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth('/user/profile');
        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [fetchWithAuth]);

  // Render component...
}
```

### With React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function UserDashboard() {
  const { fetchWithAuth } = useApi();

  const { data, error, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: () => fetchWithAuth('/user/dashboard')
  });

  // Render component...
}
```

### Posting Data

```typescript
function CreatePost() {
  const { fetchWithAuth } = useApi();

  const handleSubmit = async (postData) => {
    try {
      const response = await fetchWithAuth('/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      // Handle successful post creation
    } catch (error) {
      // Handle error
    }
  };

  // Render component...
}
```

## Best Practices

1. **Use React Query**: For complex data fetching and caching, combine the API client with React Query.

2. **Error Boundaries**: Implement error boundaries to catch and handle API errors gracefully.

3. **Loading States**: Always handle loading states to provide good UX.

4. **Type Safety**: Use TypeScript interfaces for your request and response data.

5. **Environment Variables**: Don't hardcode API URLs. Use the provided configuration.

## Common Pitfalls to Avoid

1. ❌ Don't create new instances of fetch or axios
2. ❌ Don't manually handle authentication headers
3. ❌ Don't store API keys in components
4. ❌ Don't ignore error handling
5. ❌ Don't make API calls outside of the provided hook

## Need Help?

If you need to add new API functionality or have questions about the API client, please consult the team lead or refer to the API documentation.