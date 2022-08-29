import {useMutation, useQuery} from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useWish = () => {
    const token = localStorage.getItem('token');

    const { refetch, error, data, isLoading } = useQuery(
        queries.user.useWish.key,
        () => queries.user.useWish.query({ token })
    );

    return {
        error,
        data,
        isLoading,
        refetch,
    };
};

export const useAddProductWish = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.user.useAddProductWish.key,
        queries.user.useAddProductWish.query
    );

    const mutationAddWishById = useCallback(
        (token, { idProduct, quantity }) => {
            mutate({ idProduct, token, quantity });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationAddWishById,
    };
};

export const useDeleteProductWish = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.user.useDeleteProductWish.key,
        queries.user.useDeleteProductWish.query
    );

    const mutationDeleteWishById = useCallback(
        (token, { idProduct }) => {
            mutate({ idProduct, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationDeleteWishById,
    };
};
