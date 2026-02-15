import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [initializeAuth]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountToken");
    localStorage.removeItem("faceToken");
    setCurrentUser(null);
    // Dispatch storage event to other tabs
    window.dispatchEvent(new Event("storage"));
  }, []);

  // Login function
  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        logout,
        login,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
