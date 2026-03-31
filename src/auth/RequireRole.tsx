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
  const { loading, role: userRole, user } = useAuth();

  // Debug logging
  console.log("RequireRole:", { 
    loading, 
    userRole, 
    expectedRole: role, 
    hasUser: !!user,
    userEmail: user?.email,
    isMatch: userRole === role
  });

  // If still loading, show loading screen
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If no role found, redirect to login
  if (!userRole) {
    console.log("No role found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match, redirect to correct dashboard
  if (userRole !== role) {
    console.log(`Role mismatch: user has ${userRole}, expected ${role}`);
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
}

