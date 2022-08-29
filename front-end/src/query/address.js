import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useAddresses = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.address.useAddresses.key,
        queries.address.useAddresses.query
    );

    const mutationAddresses = useCallback(
        (token, { params }) => {
          mutate({ token, params });
        },
        []
    );

    return {
      error,
      data: data?.data?.addresses,
      isLoading,
      mutationAddresses,
    };
  };

export const useAddressesById = (userId) => {
    const token = localStorage.getItem('token');

    const { refetch, error, data, isLoading } = useQuery(
        queries.address.useAddressesById.key,
        () => queries.address.useAddressesById.query({ token, params: '', userId })
    );

    return {
        error,
        data: data?.data?.addresses,
        isLoading,
        refetch,
    };
};

  export const useAddress = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.address.useAddress.key,
        queries.address.useAddress.query
    );

    const mutationAddress = useCallback(
        (token, { idAddress }) => {
          mutate({ token, idAddress });
        },
        []
    );

    return {
      error,
      data: data?.data?.address,
      isLoading,
      mutationAddress,
    };
  };

export const useAddAddress = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.address.useAddAddress.key,
        queries.address.useAddAddress.query
    );

    const mutationAddAddress = useCallback(
        (token, { params }) => {
            mutate({ token, params });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationAddAddress,
    };
};

export const useRemoveAddress = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.address.useRemoveAddress.key,
        queries.address.useRemoveAddress.query
    );

    const mutationRemoveAddress = useCallback(
        (token, { addressId }) => {
            mutate({ token, addressId });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationRemoveAddress,
    };
};
