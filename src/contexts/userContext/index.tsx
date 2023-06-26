"use client";

import { IUser } from "@/pages/api/oauth/login";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "material-ui-snackbar-provider";

export interface UserContextType {
  user: IUser;
  changeUser: (newValue: IUser) => Promise<void>;
  logOut: () => void;
}

export const UserContext = createContext({});

export const getUser = () => {
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  try {
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    null
  }
  return {};
};

export const UserProvider = ({ children }: { children: any }) => {
  const { push } = useRouter();
  const snackbar = useSnackbar();
  const [user, setUser] = useState<IUser>(getUser());

  const handleMessage = useCallback(
    (message = "Something happened!") => {
      snackbar.showMessage(message);
    },
    [snackbar]
  );

  const changeUser = async (value: IUser) => {
    localStorage.setItem("user", JSON.stringify(value));
    setUser(value);
  };

  const logOut = useCallback(() => {
    push("/");
    setUser({} as IUser);
    localStorage.removeItem("user");
  }, [push]);

  if (axios?.defaults?.headers) {
    axios.defaults.headers.common["Authorization"] = user.accessToken;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["userid"] = user?.id;
    axios.defaults.headers.common["usertype"] = user?.type;
    axios.defaults.headers.common["useremail"] = user?.email;

    axios.interceptors.request.use(
      (request: InternalAxiosRequestConfig<any>) => {
        if (request && !request.url?.includes("/api/oauth")) {
          if (!request?.headers?.Authorization) {
            debugger
            logOut();
            return Promise.reject(new Error("Token expirado"));
          }
        }
        return request;
      }
    );
    axios.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response;
      },
      (err: any) => {
        if (
          err &&
          err.response.status === 403 &&
          err.response.data.error === "Token expirado"
        ) {
          debugger
          logOut();
        }
        console.log("err.response", err.response);
        handleMessage(err.response?.data?.error || err.message);
        return Promise.reject(err);
      }
    );
  }

  return (
    <UserContext.Provider value={{ user, changeUser, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext) as UserContextType;
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
