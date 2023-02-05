import * as React from "react";

type UserState<User> =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      user: User | undefined;
    };

type User = { userName: string };

type AuthContextValue = {
  userState: UserState<User>;
  login: (user: User) => void;
  logout: () => void;
  // デバッグ用
  setUserState: (userState: UserState<User>) => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userState, setUserState] = React.useState<UserState<User>>({
    isLoading: true,
  });

  React.useEffect(() => {
    const timer = setTimeout(
      () =>
        setUserState({
          isLoading: false,
          user: { userName: "tekihei2317" },
          // user: undefined,
        }),
      500
    );

    return () => clearTimeout(timer);
  }, []);

  const login = React.useCallback(
    (user: User) => setUserState({ isLoading: false, user }),
    []
  );

  const logout = React.useCallback(
    () => setUserState({ isLoading: false, user: undefined }),
    []
  );

  return (
    <AuthContext.Provider value={{ userState, login, logout, setUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextValue {
  const value = React.useContext(AuthContext);

  if (value === undefined) {
    throw new Error("Auth context is not provided.");
  }

  return value;
}

export function useAuthenticatedUser(): User {
  const { userState } = useAuthContext();

  if (userState.isLoading) throw new Error("User is loading");
  if (userState.user === undefined) throw new Error("User is not logged in");

  return userState.user;
}
