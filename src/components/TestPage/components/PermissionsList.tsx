import { Shield } from 'lucide-react';

interface PermissionsListProps {
  permissions: string[];
}

export function PermissionsList({ permissions }: PermissionsListProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-[var(--color-primary)]" />
        Permissions
      </h2>
      <div className="flex flex-wrap gap-2">
        {permissions.length > 0 ? (
          permissions.map((permission) => (
            <span
              key={permission}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
            >
              {permission}
            </span>
          ))
        ) : (
          <p className="text-[var(--color-textSecondary)]">No permissions assigned</p>
        )}
      </div>
    </section>
  );
}