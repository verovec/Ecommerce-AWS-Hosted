import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useProducts = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useProducts.key,
        queries.product.useProducts.query
    );

    const mutationAllProducts = useCallback(
        ({ params }) => {
          mutate({ params });
        },
        []
    );

    return {
      error,
      data:data?.data?.products,
      isLoading,
      mutationAllProducts,
    };
  };

  export const useProduct = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useProduct.key,
        queries.product.useProduct.query
    );

    const mutationProduct = useCallback(
        ({ idProduct }) => {
          mutate({ idProduct });
        },
        []
    );

    return {
      error,
      data:data?.data?.product,
      isLoading,
      mutationProduct,
    };
  };

export const useDispatchProduct = () => {
    const token = localStorage.getItem('token');
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useDispatchProduct.key,
        queries.product.useDispatchProduct.query
    );

    const mutationDispatchProduct = useCallback(
        ({ idProduct, idOrder }) => {
            mutate({ idProduct, idOrder, token });
        },
        []
    );

    return {
        error,
        data,
        isLoading,
        mutationDispatchProduct,
    };
};

  export const useUpdateProduct = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useUpdateProduct.key,
        queries.product.useUpdateProduct.query
    );

    const mutationUpdateProduct = useCallback(
        (token, { idProduct, price, name, categories, tags, quantity, description, state }) => {
          mutate({ token, idProduct, price, name, categories, tags, quantity, description, state });
        },
        []
    );

    return {
      error,
      data,
      isLoading,
      mutationUpdateProduct,
    };
  };

  export const useDeleteProduct = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useDeleteProduct.key,
        queries.product.useDeleteProduct.query
    );

    const mutationDeleteProduct = useCallback(
        ({ idProduct }) => {
            const token = localStorage.getItem('token');
          mutate({ token, idProduct });
        },
        []
    );

    return {
      error,
      data,
      isLoading,
      mutationDeleteProduct,
    };
  };

  export const useCreateProduct = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.product.useCreateProduct.key,
        queries.product.useCreateProduct.query
    );

    const mutationCreateProduct = useCallback(
        ({ description, price, name, mark, categories, tags, quantity }) => {
            const token = localStorage.getItem('token');
          mutate({ token, description, price, name, mark, categories, tags, quantity });
        },
        []
    );

    return {
      error,
      data,
      isLoading,
      mutationCreateProduct,
    };
  };

export const useProductOrders = (idProduct) => {
    const token = localStorage.getItem('token');

    const { error, data, isLoading, refetch } = useQuery(
        queries.product.useOrdersProduct.key,
        () => queries.product.useOrdersProduct.query({ token, idProduct })
    );

    return {
        error,
        data: data?.data?.orders,
        isLoading,
        refetch,
    };
};
