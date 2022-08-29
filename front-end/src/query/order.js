import {useMutation} from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useCreateOrder = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.orders.useCreateOrder.key,
        queries.orders.useCreateOrder.query
    );

    const mutationCreateOrder = useCallback(
        (token, { addressId}) => {
            mutate({ addressId, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationCreateOrder,
    };
};

export const useGetOrders = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.orders.useGetOrders.key,
        queries.orders.useGetOrders.query
    );


    const mutationGetOrders = useCallback(
        ({userId}) => {
            const token = localStorage.getItem('token');
            mutate({ userId, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationGetOrders,
    };
};

export const useGetSellerOrders = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.orders.useGetSellerOrders.key,
        queries.orders.useGetSellerOrders.query
    );


    const mutationGetSellerOrders = useCallback(
        ({userId}) => {
            const token = localStorage.getItem('token');
            mutate({ userId, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationGetSellerOrders,
    };
};
