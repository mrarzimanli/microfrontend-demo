import { renderHook, act } from "@testing-library/react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { MOCK_USER } from "@/data/user";
import type { User } from "@micro/shared-types";

const ANOTHER_USER: User = {
    id: "u-2",
    fullName: "Jane Doe",
    email: "jane@example.com",
    role: "editor",
};

describe("SessionProvider / useSession", () => {
    it("provides an authenticated session by default using the mock user", () => {
        const { result } = renderHook(() => useSession(), { wrapper: SessionProvider });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(MOCK_USER);
    });

    it("throws when consumed outside of a SessionProvider", () => {
        // Suppress the React error boundary console output for this test.
        vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => renderHook(() => useSession())).toThrow("useSession must be used inside <SessionProvider>");

        vi.restoreAllMocks();
    });

    it("logout sets user to null and marks the session as unauthenticated", () => {
        const { result } = renderHook(() => useSession(), { wrapper: SessionProvider });

        act(() => result.current.logout());

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("login replaces the current user and keeps the session authenticated", () => {
        const { result } = renderHook(() => useSession(), { wrapper: SessionProvider });

        act(() => result.current.login(ANOTHER_USER));

        expect(result.current.user).toEqual(ANOTHER_USER);
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("login after logout restores an authenticated session", () => {
        const { result } = renderHook(() => useSession(), { wrapper: SessionProvider });

        act(() => result.current.logout());
        expect(result.current.isAuthenticated).toBe(false);

        act(() => result.current.login(MOCK_USER));
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(MOCK_USER);
    });

    it("exposes stable login and logout references across re-renders", () => {
        const { result, rerender } = renderHook(() => useSession(), { wrapper: SessionProvider });

        const loginRef = result.current.login;
        const logoutRef = result.current.logout;

        // Trigger a re-render without changing state.
        rerender();

        expect(result.current.login).toBe(loginRef);
        expect(result.current.logout).toBe(logoutRef);
    });
});
