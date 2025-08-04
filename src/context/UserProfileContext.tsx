"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
// Firebase is completely disabled in offline mode
// All Firebase logic removed. Only offline logic remains.

export interface UserProfile {
  uid: string;
  status: string;
  [key: string]: any;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ uid, children }: { uid: string; children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // In offline mode, just set loading to false and userProfile to null
  const fetchProfile = async () => {
    setLoading(false);
    setUserProfile(null);
  };

  useEffect(() => {
    fetchProfile();
  }, [uid]);

  return (
    <UserProfileContext.Provider value={{ userProfile, loading, refreshProfile: fetchProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) throw new Error("useUserProfile must be used within a UserProfileProvider");
  return context;
}
