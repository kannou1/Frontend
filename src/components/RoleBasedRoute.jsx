import { Navigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { ROUTES } from '@/constants/routes';

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};
