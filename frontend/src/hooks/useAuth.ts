import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type LocalUser = {
  id: number;
  email: string | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string;
  avatar: string | null;
  phone: string | null;
  company: string | null;
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user: LocalUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        email: oauthUser.email ?? null,
        name: oauthUser.name ?? null,
        firstName: oauthUser.firstName ?? null,
        lastName: oauthUser.lastName ?? null,
        role: oauthUser.role,
        avatar: oauthUser.avatar ?? null,
        phone: oauthUser.phone ?? null,
        company: oauthUser.company ?? null,
      };
    }
    if (localUser) {
      return localUser;
    }
    return null;
  }, [oauthUser, localUser]);

  const isLoading = oauthLoading || localLoading;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
      logout,
      refresh: () => utils.invalidate(),
    }),
    [user, isAuthenticated, isAdmin, isLoading, logout, utils],
  );
}
