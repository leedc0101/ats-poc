import { useQuery } from "@tanstack/react-query";

export const useOrderbook = () => {
  return useQuery({
    queryKey: ["orderbook"],
    queryFn: async () => {
      const response = await fetch("/api/orderbook");
      return response.json();
    },
    refetchInterval: 1000,
  });
};

export const useTrade = () => {
  return useQuery({
    queryKey: ["trade"],
    queryFn: async () => {
      const response = await fetch("/api/trade");
      return response.json();
    },
    refetchInterval: 1000,
  });
};
