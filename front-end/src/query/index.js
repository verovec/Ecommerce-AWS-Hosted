import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useUser = () => {
  const token = localStorage.getItem('token');

  const { error, data, isLoading, refetch } = useQuery(
      queries.user.useUser.key,
      () => queries.user.useUser.query(token)
  );

  return { error, user: data?.data?.user, isLoading, refetch };
};

export const useUserById = (userId) => {
  const token = localStorage.getItem('token');

  const { error, data, isLoading, refetch } = useQuery(
      queries.user.useUserById.key,
      () => queries.user.useUserById.query(token, userId)
  );

  return { error, user: data?.data?.user, isLoading, refetch };
};

export const useUsers = () => {
  const token = localStorage.getItem('token');

  const { error, data, isLoading, refetch } = useQuery(
      queries.user.useUsers.key,
      () => queries.user.useUsers.query(token)
  );

  return { error, users: data?.data?.users, isLoading, refetch };
};

export const useLogin = () => {
  const { mutate, error, data, isLoading } = useMutation(
      queries.auth.useLogin.key,
      queries.auth.useLogin.query
  );

  const mutationLogin = useCallback(
      ({ email, password }) => {
        mutate({ email, password });
      },
      []
  );

  return {
    error,
    data,
    isLoading,
    mutationLogin,
  };
};

export const useRegister = () => {
  const { mutate, error, data, isLoading } = useMutation(
      queries.auth.useRegister.key,
      queries.auth.useRegister.query
  );

  const mutationRegister = useCallback(
      ({ name, password, birthDate, email }) => {
        mutate({ name, password, birthDate, email });
      },
      []
  );

  return {
    error,
    data,
    isLoading,
    mutationRegister,
  };
};

export const useDisableAccount = () => {
  const token = localStorage.getItem('token');

  const { mutate, error, data, isLoading } = useMutation(
      queries.auth.useDisableAccount.key,
      queries.auth.useDisableAccount.query
  );

  const mutationDisableAccount = useCallback(
      () => {
        mutate({ token });
      },
      []
  );

  return {
    error,
    data,
    isLoading,
    mutationDisableAccount,
  };
};

export const useDisableAccountById = () => {
  const token = localStorage.getItem('token');

  const { mutate, error, data, isLoading } = useMutation(
      queries.auth.useDisableAccountById.key,
      queries.auth.useDisableAccountById.query
  );

  const mutationDisableAccount = useCallback(
      (userId) => {
        mutate({ token, userId });
      },
      []
  );

  return {
    error,
    data,
    isLoading,
    mutationDisableAccount,
  };
};

export const useEnableAccountById = () => {
  const token = localStorage.getItem('token');

  const { mutate, error, data, isLoading } = useMutation(
      queries.auth.useEnableAccountById.key,
      queries.auth.useEnableAccountById.query
  );

  const mutationEnableAccount = useCallback(
      (userId) => {
        mutate({ token, userId });
      },
      []
  );

  return {
    error,
    data,
    isLoading,
    mutationEnableAccount,
  };
};
