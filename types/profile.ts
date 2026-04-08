/**
 * Photo Upload Modal Component
 */
export interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
  isLoading: boolean;
  progress: number;
  currentAvatar?: string;
  initials: string;
}

/**
 * User profile data interface
 */
export interface UserProfile {
  fullName: string;
  email: string;
  lastLogin: string;
  avatarUrl?: string;
  role?: string;
}

/**
 * Success Toast Component
 */
export interface SuccessToastProps {
  message: SuccessMessage | null;
}

/**
 * Success message interface
 */
export interface SuccessMessage {
  title: string;
  description: string;
}
