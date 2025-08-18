import React, {
  createContext,
  useState,
  useEffect,
} from "react";


// ✅ Define the User type
type User = {
  name: string;
  email: string;
};

// ✅ Define the AuthContext type
type AuthContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
};

// ✅ Create the context with an undefined default
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() =>
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token") || null
  );

  // ✅ Sync with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext safely
// Moved to useAuth.ts
