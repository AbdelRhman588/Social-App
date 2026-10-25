import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  userLogin: string | null;
  setuserLogin: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userLogin, setuserLogin] = useState<string | null>(
    localStorage.getItem("userToken")
  );
  const [userId, setuserId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = jwtDecode<{ user?: string; id?: string; _id?: string }>(token);
        setuserId(decoded.user ?? decoded.id ?? decoded._id ?? "");
      } catch (err) {
        console.log("invalid token", err);
        setuserId("");
      }
    } else {
      setuserId("");
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
}