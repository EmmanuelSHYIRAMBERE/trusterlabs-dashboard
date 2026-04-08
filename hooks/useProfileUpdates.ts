"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/types/profile";

export function useProfileUpdates() {
  const { data: session, update } = useSession();
  // Holds the latest avatarUrl set locally so session re-syncs don't overwrite it
  const pendingAvatarRef = useRef<string | undefined>(undefined);

  const [profile, setProfile] = useState<UserProfile | null>(
    session?.user
      ? {
          fullName: session.user.name || "",
          email: session.user.email || "",
          lastLogin: new Date().toLocaleString(),
          avatarUrl: session.user.image || undefined,
          role: session.user.role || "",
        }
      : null,
  );

  // Sync from session but always prefer pendingAvatarRef over session.image
  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        fullName: session.user.name || "",
        email: session.user.email || "",
        lastLogin: prev?.lastLogin || new Date().toLocaleString(),
        // Use pending local avatar if set, otherwise fall back to session
        avatarUrl: pendingAvatarRef.current ?? session.user.image ?? undefined,
        role: session.user.role || "",
      }));
    }
  }, [session]);

  const updateSessionProfile = async (updatedProfile: UserProfile) => {
    pendingAvatarRef.current = updatedProfile.avatarUrl;

    try {
      await update({
        user: {
          name: updatedProfile.fullName,
          email: updatedProfile.email,
          image: updatedProfile.avatarUrl ?? null,
        },
      });
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  };

  const setProfileAndPersist = (updated: UserProfile) => {
    if (updated.avatarUrl) {
      pendingAvatarRef.current = updated.avatarUrl;
    }
    setProfile(updated);
  };

  return {
    profile,
    setProfile: setProfileAndPersist,
    updateSessionProfile,
  };
}
