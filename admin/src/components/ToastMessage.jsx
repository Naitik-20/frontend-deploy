import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

export default function ToastMessage() {
  const { actionStatus } = useAdminDashboard();
  if (!actionStatus) return null;

  return (
    <div className={`dashboard-toast animate-fade ${actionStatus.type}`}>
      {actionStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span>{actionStatus.message}</span>
    </div>
  );
}
