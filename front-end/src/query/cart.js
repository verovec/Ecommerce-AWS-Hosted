import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useCart = () => {
    const token = localStorage.getItem('token');

    const { error, data, isLoading, refetch } = useQuery(
        queries.user.useCart.key,
        () => queries.user.useCart.query({ token })
    );

    return {
      error,
      data: data?.data?.cart,
      isLoading,
      refetch,
    };
  };

  export const useAddProductCart = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.user.useAddProductCart.key,
        queries.user.useAddProductCart.query
    );

    const mutationAddCart = useCallback(
        (token, { idProduct, quantity }) => {
          mutate({ idProduct, quantity, token });
        },
        []
    );

    return {
      error,
      data,
      isLoading,
      mutationAddCart,
    };
  };

export const useDeleteProductCart = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.user.useDeleteProductCart.key,
        queries.user.useDeleteProductCart.query
    );

    const mutationDeleteCartById = useCallback(
        async (token, { idProduct }) => {
            await mutate({ idProduct, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationDeleteCartById,
    };
};
