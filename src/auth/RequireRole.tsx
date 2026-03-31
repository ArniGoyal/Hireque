import { Navigate } from "react-router-dom";
import type { AppRole } from "@/types/app";
import { useAuth } from "@/auth/AuthProvider";

export function RequireRole({
  role,
  children,
}: {
  role: AppRole;
  children: React.ReactNode;
}) {
  const { loading, role: userRole } = useAuth();

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!userRole) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to={`/dashboard/${userRole}`} replace />;

  return <>{children}</>;
}

