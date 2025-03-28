import { ApiResponse } from '../../../types/api';
import { sanitizeHeaders } from '../../../utils/api';

interface ApiTestResultsProps {
  loading: boolean;
  error: string | null;
  apiResponse: ApiResponse | null;
}

export function ApiTestResults({ loading, error, apiResponse }: ApiTestResultsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">API Test Results</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : error ? (
        <div className="badge badge-error">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-gray-50">
            <div className="card-header">
              <h3 className="font-semibold">Request Details</h3>
            </div>
            <div className="card-body">
              <div className="space-y-2">
                <p><span className="font-medium">URL:</span> {apiResponse?.debug.url}</p>
                <div>
                  <p className="font-medium mb-2">Headers:</p>
                  <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(sanitizeHeaders(apiResponse?.debug.headers), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card bg-gray-50">
            <div className="card-header">
              <h3 className="font-semibold">Response Data</h3>
            </div>
            <div className="card-body">
              <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(apiResponse?.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}