import * as React from "react";

type UserState<User> =
  | {
      isLoading: true;
    }
  | {
      isLoading: false;
      user: User | undefined;
    };

// 持っている属性が違うことのいい例を作りたい
export type GeneralUser = { type: "general"; userName: string; userId: number };
export type AdminUser = { type: "admin"; userName: string };
export type User = GeneralUser | AdminUser;

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

  // React.useEffect(() => {
  //   const timer = setTimeout(
  //     () =>
  //       setUserState({
  //         isLoading: false,
  //         user: { type: "admin", userName: "tekihei2317" },
  //         // user: undefined,
  //       }),
  //     500
  //   );

  //   return () => clearTimeout(timer);
  // }, []);

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
