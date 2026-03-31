import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { loading, user } = useAuth();

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

