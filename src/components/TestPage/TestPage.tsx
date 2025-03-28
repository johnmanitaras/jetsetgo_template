import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserInfo } from './components/UserInfo';
import { GroupsList } from './components/GroupsList';
import { PermissionsList } from './components/PermissionsList';
import { ApiTestResults } from './components/ApiTestResults';
import { ApiResponse } from '../../types/api';

export function TestPage() {
  const { user, tenant, userId, groups, permissions } = useAuth();
  const { fetchWithAuth } = useApi();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('/tracks_limits');
        setApiResponse(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchWithAuth]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h1 className="text-2xl font-bold">Authentication Test Page</h1>
              <button
                onClick={handleSignOut}
                className="btn-secondary text-[var(--color-error)] hover:bg-red-50 hover:border-red-200 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            <div className="card-body space-y-8">
              <UserInfo user={user} tenant={tenant} userId={userId} />
              <GroupsList groups={groups} />
              <PermissionsList permissions={permissions} />
              <ApiTestResults
                loading={loading}
                error={error}
                apiResponse={apiResponse}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}