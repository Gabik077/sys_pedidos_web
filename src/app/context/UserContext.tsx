"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  role: string | null;
  token: string | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  role: null,
  token: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status === "ok" && data.user) {
          setRole(data.user.role);
          setToken(data.token ?? null); // si el backend incluye el token en la respuesta
        }else{
         // Solo mostrar alerta y redirigir si NO estamos en /login
         if (window.location.pathname !== "/login") {
          alert("Sesión expirada, por favor inicia sesión nuevamente");
          window.location.href = "/login";
        }

        }
        setLoading(false);
      } catch (e) {
        console.error("Error al obtener datos del usuario", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ role, token, loading }}>
      {children}
    </UserContext.Provider>
  );
}
