import { useQuery } from "@tanstack/react-query";

export const useOrderbook = (symbol: string) => {
  console.log("asd");
  return useQuery({
    queryKey: ["orderbook", symbol],
    queryFn: async () => {
      const response = await fetch(`/api/orderbook?symbol=${symbol}`);
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
