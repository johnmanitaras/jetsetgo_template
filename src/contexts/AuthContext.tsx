import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authChannel } from '../lib/broadcast';
import { TenantInfo, GroupInfo } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  tenant: TenantInfo | null;
  userId: string | null;
  groups: GroupInfo[];
  permissions: string[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  tenant: null,
  userId: null,
  groups: [],
  permissions: [],
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const tenantClaim = idTokenResult.claims.tenant as TenantInfo;
        const user_id = idTokenResult.claims.user_id as string;
        const groupsClaim = idTokenResult.claims.groups as GroupInfo[] || [];
        const permissionsClaim = idTokenResult.claims.permissions as string[] || [];

        setTenant(tenantClaim || null);
        setUserId(user_id || null);
        setGroups(groupsClaim);
        setPermissions(permissionsClaim);
      } else {
        setTenant(null);
        setUserId(null);
        setGroups([]);
        setPermissions([]);
      }
      setUser(user);
      setLoading(false);
    });

    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_STATE_CHANGED') {
        setUser(event.data.user);
        setTenant(event.data.tenant || null);
        setUserId(event.data.userId || null);
        setGroups(event.data.groups || []);
        setPermissions(event.data.permissions || []);
      }
    };

    authChannel.addEventListener('message', handleAuthMessage);

    return () => {
      unsubscribe();
      authChannel.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const value = {
    user,
    loading,
    tenant,
    userId,
    groups,
    permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}