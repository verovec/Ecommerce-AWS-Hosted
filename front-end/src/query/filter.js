import { useMutation, useQuery } from "react-query";
import {queries} from "./queries";
import {useCallback} from "react";

export const useCategories = () => {
  
    const { error, data, isLoading, refetch } = useQuery(
        queries.filter.useCategories.key,
        () => queries.filter.useCategories.query()
    );
  
    return { 
        error,
        data: data?.data?.categories,
        isLoading,
        refetch 
    };
  };