import useWebSocket, { ReadyState } from "react-use-websocket";
import { Orderbook } from "./Orderbook";
import { WS_API_ENDPOINT } from "@/constant";
import { useRecoilValue } from "recoil";
import { $selectedSymbol } from "@/atom";

type OrderbookBase = {
  bids: { price: string; volume: string }[];
  asks: { price: string; volume: string }[];
  time: number;
  tot_ask_vol: string;
  tot_bid_vol: string;
  exchange_orderbooks: Record<string, OrderbookBase>;
};

const getSocketUrl = (symbol: string) =>
  `${WS_API_ENDPOINT}/orderbook/${symbol}`;

export const OrderbookContainer = () => {
  const selectedSymbol = useRecoilValue($selectedSymbol);

  const { lastJsonMessage, readyState } = useWebSocket<OrderbookBase>(
    getSocketUrl(selectedSymbol),
    {
      onOpen: () => console.log("opened"),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    },
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  if (readyState !== ReadyState.OPEN || !lastJsonMessage) {
    return <div>Connecting...</div>;
  }

  const bids = (lastJsonMessage.bids ?? []).map(
    (el) => [Number(el.price), Number(el.volume)] as [number, number],
  );

  const asks = (lastJsonMessage.asks ?? []).map(
    (el) => [Number(el.price), Number(el.volume)] as [number, number],
  );

  return (
    <Orderbook
      book={{
        asks,
        bids,
      }}
    />
  );
};
