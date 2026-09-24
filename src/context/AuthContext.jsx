import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  isFirebaseConfigured
} from '../utils/firebase';
import {
  getSafeAvatarUrl,
  sanitizeText,
  validateStatsSchema,
  secureStorage
} from '../utils/security';

const AuthContext = createContext(null);

const STORAGE_USER_KEY = 'ds_roulette_user_profile';
const STORAGE_STATS_KEY = 'ds_roulette_user_stats';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = secureStorage.getItem(STORAGE_USER_KEY);
      if (saved && typeof saved === 'object') {
        // Automatically purge obsolete mock user so user is not stuck on dummy account
        if (saved.email === 'fellow@datascience.org' || saved.displayName === 'Data Science Fellow') {
          secureStorage.removeItem(STORAGE_USER_KEY);
          return null;
        }
        return {
          ...saved,
          displayName: sanitizeText(saved.displayName, 50),
          photoURL: getSafeAvatarUrl(saved.photoURL, saved.displayName)
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const saved = secureStorage.getItem(STORAGE_STATS_KEY);
      return validateStatsSchema(saved);
    } catch {
      return validateStatsSchema(null);
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Listen for real Firebase auth state changes if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const profile = {
          uid: sanitizeText(fbUser.uid, 50),
          displayName: sanitizeText(fbUser.displayName || 'Data Scientist', 50),
          email: sanitizeText(fbUser.email, 100),
          photoURL: getSafeAvatarUrl(fbUser.photoURL, fbUser.displayName || 'DS'),
          provider: 'google',
          isFirebaseLive: true
        };
        setUser(profile);
        secureStorage.setItem(STORAGE_USER_KEY, profile);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save stats to secureStorage
  useEffect(() => {
    secureStorage.setItem(STORAGE_STATS_KEY, stats);
  }, [stats]);

  // Record daily streak logic
  const recordStudyActivity = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];

    setStats((prev) => {
      if (prev.lastActiveDate === today) {
        return prev;
      }

      // Check if last active was yesterday
      const lastDate = new Date(prev.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newStreak = prev.streak;
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // streak reset
      }

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today
      };
    });
  }, []);

  // Record quiz result
  const recordQuizResult = useCallback((isCorrect) => {
    recordStudyActivity();
    setStats((prev) => ({
      ...prev,
      quizzesAttempted: prev.quizzesAttempted + 1,
      quizzesCorrect: isCorrect ? prev.quizzesCorrect + 1 : prev.quizzesCorrect
    }));
  }, [recordStudyActivity]);

  // Record spin
  const recordSpin = useCallback(() => {
    recordStudyActivity();
    setStats((prev) => ({
      ...prev,
      totalSpins: prev.totalSpins + 1
    }));
  }, [recordStudyActivity]);

  // Google Login function
  const loginWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const profile = {
          uid: sanitizeText(fbUser.uid, 50),
          displayName: sanitizeText(fbUser.displayName || 'Data Scientist', 50),
          email: sanitizeText(fbUser.email, 100),
          photoURL: getSafeAvatarUrl(fbUser.photoURL, fbUser.displayName || 'DS'),
          provider: 'google',
          isFirebaseLive: true
        };
        setUser(profile);
        secureStorage.setItem(STORAGE_USER_KEY, profile);
        setLoading(false);
        setIsAuthModalOpen(false);
        return profile;
      } catch (err) {
        console.error("Firebase Google Auth Error:", err);
        setLoading(false);
        let message = err.message || "Google sign-in failed.";
        if (err.code === 'auth/popup-closed-by-user') {
          message = "Google sign-in popup was closed before completing.";
        } else if (err.code === 'auth/unauthorized-domain') {
          message = "This domain (e.g. localhost or current URL) is not added to Authorized Domains in Firebase Console.";
        } else if (err.code === 'auth/operation-not-allowed') {
          message = "Google Provider is disabled. Please enable 'Google' under Firebase Authentication → Sign-in method.";
        } else if (err.code === 'auth/invalid-api-key') {
          message = "Invalid Firebase API Key. Please verify your pasted credentials.";
        }
        setAuthError(message);
        setIsAuthModalOpen(true);
      }
    } else {
      setLoading(false);
      setIsAuthModalOpen(true);
    }
  };

  // Complete login handler (for custom/manual email)
  const completeCustomLogin = (customName, customEmail) => {
    setAuthError(null);
    const cleanName = sanitizeText(customName || 'Data Scientist', 50);
    const cleanEmail = sanitizeText(customEmail || 'scholar@datascience.org', 100);
    const profile = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: cleanName,
      email: cleanEmail,
      photoURL: getSafeAvatarUrl(null, cleanName),
      provider: 'google',
      isFirebaseLive: false,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUser(profile);
    secureStorage.setItem(STORAGE_USER_KEY, profile);
    recordStudyActivity();
    setIsAuthModalOpen(false);
    return profile;
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (_) {}
    }
    setUser(null);
    setAuthError(null);
    secureStorage.removeItem(STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        stats,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        completeCustomLogin,
        logout,
        recordQuizResult,
        recordSpin,
        recordStudyActivity,
        isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
