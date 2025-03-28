# Guidelines for Importing SPAs into Template

## Overview

This document outlines the recommended approach for importing existing Single Page Applications (SPAs) into this template. The template provides centralized authentication, permissions handling, and API management. Following these guidelines ensures a clean and maintainable integration.

## Import Structure

1. Create a dedicated import folder:
```bash
/import-spa/
  ├── README.md           # Document components and their purposes
  ├── components/         # Your SPA components
  ├── hooks/             # Custom hooks
  ├── styles/            # Styling files
  ├── types/             # Type definitions
  ├── utils/             # Utility functions
  ├── assets/            # Images, fonts, etc.
  └── tests/             # Test files
```

## What to Include

✅ **Include:**
- All component files
- Custom hooks and utilities
- Styling files and assets
- Type definitions
- Test files
- Component-specific configuration
- Documentation

❌ **Exclude:**
- `node_modules` directory
- Authentication code (use template's auth)
- API handling code (use template's API system)
- Permission handling (use template's permissions)
- Duplicate configuration files
- Environment files

## Documentation Requirements

Your import's README.md should include:
- Overview of main features/components
- Third-party dependencies list
- Configuration requirements
- Integration points with auth/permissions
- Known issues or considerations

## Code Organization Best Practices

1. **Component Structure**
   - Break down large components into smaller, focused ones
   - Keep files under 200 lines where possible
   - One component per file
   - Group related components in subdirectories

2. **Logic Separation**
   - Extract business logic into custom hooks
   - Move utility functions to separate files
   - Keep components focused on presentation

3. **Type Safety**
   - Include all TypeScript interfaces/types
   - Document complex type definitions
   - Maintain strict type checking

4. **Testing**
   - Include all existing tests
   - Document testing requirements
   - Note any mock dependencies

## Integration Process

1. **Initial Setup**
   - Create the import directory
   - Copy all relevant files maintaining structure
   - Document dependencies in README

2. **Code Review**
   - Identify auth integration points
   - List API calls to be migrated
   - Note permission requirements
   - Mark shared component opportunities

3. **Gradual Integration**
   - Integrate one feature at a time
   - Update components to use template patterns
   - Add permission guards where needed
   - Migrate API calls to use template system

4. **Testing**
   - Verify each integrated component
   - Test permission guards
   - Validate API integrations
   - Ensure type safety

## Common Pitfalls to Avoid

- Don't duplicate authentication logic
- Don't create new API fetch instances
- Don't implement custom permission checks
- Don't copy environment configurations
- Don't maintain parallel routing systems

## Questions to Consider

Before integration, answer these questions:
1. Which components need authentication?
2. What API endpoints are being called?
3. What permissions are required?
4. Are there shared components that could be reused?
5. What third-party dependencies are essential?

## Need Help?

If you need assistance with:
- Component integration
- Auth system usage
- API integration
- Permission implementation
- Type definitions

Please consult the template's main documentation or reach out to the team lead.