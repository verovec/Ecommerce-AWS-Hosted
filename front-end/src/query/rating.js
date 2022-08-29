import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useRating = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.rating.useRating.key,
        queries.rating.useRating.query
    );

    const mutationRating = useCallback(
        ({ idProduct }) => {
          mutate({ idProduct });
        },
        []
    );

    return {
      error,
      data: data?.data?.ratings,
      isLoading,
      mutationRating,
        fullData: data
    };
  };

  export const useCreateRating = () => {
    const { mutate, error, data, isLoading } = useMutation(
        queries.rating.useCreateRating.key,
        queries.rating.useCreateRating.query
    );

    const mutationCreateRating = useCallback(
        (token, { idProduct, message, count }) => {
          mutate({ token, idProduct, message, count });
        },
        []
    );

    return {
      error,
      data,
      isLoading,
      mutationCreateRating,
    };
  };

