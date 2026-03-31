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
      setUser(authUser);

      // Clean up any previous profile subscription.
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (!authUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const ref = doc(db, "users", authUser.uid);
      unsubProfile = onSnapshot(ref, (snap) => {
        setProfile(snap.exists() ? (snap.data() as UserProfileDoc) : null);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role = profile?.role ?? null;
    const isStudentVerified = profile?.student?.verified ?? false;

    return {
      loading,
      user,
      profile,
      role,
      isStudentVerified,
      signOut: async () => {
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

