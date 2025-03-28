import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="card text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-50 p-3">
              <ShieldAlert className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator for assistance.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}