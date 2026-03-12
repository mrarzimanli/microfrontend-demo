import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { SessionContextValue, User } from "@micro/shared-types";
import { MOCK_USER } from "@/data/user";

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(MOCK_USER);

    const login = useCallback((u: User) => setUser(u), []);
    const logout = useCallback(() => setUser(null), []);

    const value = useMemo<SessionContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            login,
            logout,
        }),
        [user, login, logout],
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
    const ctx = useContext(SessionContext);
    if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
    return ctx;
}
