import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AccountContext = createContext();

export const AccProvider = ({ children }) => {
  const [currentAcc, setCurrentAcc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize account state from localStorage
  const initializeAccount = useCallback(() => {
    const accountToken = localStorage.getItem("accountToken");

    if (accountToken) {
      try {
        const decoded = jwtDecode(accountToken);
        setCurrentAcc(decoded);
      } catch (error) {
        console.error("Invalid accountToken", error);
        localStorage.removeItem("accountToken");
        setCurrentAcc(null);
      }
    } else {
      setCurrentAcc(null);
    }
    setIsLoading(false);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAccount();
  }, [initializeAccount]);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accountToken") {
        initializeAccount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [initializeAccount]);

  // Logout function - clears account data
  const logout = useCallback(() => {
    localStorage.removeItem("accountToken");
    setCurrentAcc(null);
  }, []);

  // Set account function
  const setAccount = useCallback((accountToken) => {
    localStorage.setItem("accountToken", accountToken);
    try {
      const decoded = jwtDecode(accountToken);
      setCurrentAcc(decoded);
    } catch (error) {
      console.error("Invalid accountToken", error);
      localStorage.removeItem("accountToken");
      setCurrentAcc(null);
    }
  }, []);

  return (
    <AccountContext.Provider
      value={{
        currentAcc,
        isLoading,
        logout,
        setAccount,
        hasAccount: !!currentAcc,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAcc = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAcc must be used within an AccProvider");
  }
  return context;
};
