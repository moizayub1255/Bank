import { useCallback } from "react";
import { useAuth } from "./AppContext";
import { useAcc } from "./AccountContext";

/**
 * Custom hook for handling logout across all auth contexts
 * Clears all tokens and resets auth state globally
 */
export const useLogout = () => {
  const { logout: logoutAuth } = useAuth();
  const { logout: logoutAcc } = useAcc();

  const logout = useCallback(() => {
    // Clear all localStorage tokens
    localStorage.removeItem("token");
    localStorage.removeItem("accountToken");
    localStorage.removeItem("faceToken");

    // Update all context states
    logoutAuth();
    logoutAcc();

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("userLogout"));

    // Dispatch storage event to sync across tabs
    window.dispatchEvent(new Event("storage"));
  }, [logoutAuth, logoutAcc]);

  return { logout };
};
