import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppRole } from "@/types/app";
import type { UserProfileDoc } from "@/types/user";
import { listenToAuthStateChanges, signOutUser } from "@/firebase/auth";
import { db } from "@/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

type AuthContextValue = {
  loading: boolean;
  user: { uid: string; email: string } | null;
  profile: UserProfileDoc | null;
  role: AppRole | null;
  isStudentVerified: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfileDoc | null>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubAuth = listenToAuthStateChanges((authUser) => {
      console.log("Auth state changed:", authUser?.email);
      setUser(authUser);

      // Clean up any previous profile subscription.
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (!authUser) {
        setProfile(null);
        localStorage.removeItem("pendingUserRole");
        setLoading(false);
        return;
      }

      setLoading(true);
      const ref = doc(db, "users", authUser.uid);
      
      // Set a timeout to stop loading after 3 seconds regardless
      const loadingTimeout = setTimeout(() => {
        console.warn("Profile loading timeout - stopping loading state");
        setLoading(false);
      }, 3000);
      
      unsubProfile = onSnapshot(ref, (snap) => {
        clearTimeout(loadingTimeout);
        console.log("Profile loaded:", snap.exists(), snap.data());
        const profileData = snap.exists() ? (snap.data() as UserProfileDoc) : null;
        setProfile(profileData);
        
        // Store role in localStorage as fallback
        if (profileData?.role) {
          localStorage.setItem("pendingUserRole", profileData.role);
        }
        
        setLoading(false);
      }, (error) => {
        clearTimeout(loadingTimeout);
        console.error("Error loading profile:", error);
        setProfile(null);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    // Try to get role from profile, fallback to localStorage if profile hasn't loaded
    let role = profile?.role ?? null;
    
    if (!role && user) {
      // If user is authenticated but profile hasn't loaded, check localStorage
      const storedRole = localStorage.getItem("pendingUserRole");
      if (storedRole) {
        console.log("Using stored role from localStorage:", storedRole);
        role = storedRole as AppRole;
      }
    }
    
    const isStudentVerified = profile?.student?.verified ?? false;

    console.log("Auth context value:", { 
      loading, 
      hasUser: !!user, 
      hasProfile: !!profile, 
      role,
      userEmail: user?.email 
    });

    return {
      loading,
      user,
      profile,
      role,
      isStudentVerified,
      signOut: async () => {
        localStorage.removeItem("pendingUserRole");
        await signOutUser();
      },
    };
  }, [loading, profile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

