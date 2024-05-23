import { REST_API_ENDPOINT, WS_API_ENDPOINT } from "@/constant";
import { configurationData, resolutionMap } from "./config";
import { symbols } from "./constant";

// const resolutionMap = {
//   1: "1m",
//   5: "5m",
//   15: "15m",
//   60: "1h",
//   240: "4h",
//   "1D": "1d",
// };

const channelToSubscription = new Map();

export const onReady = (callback: any) => {
  setTimeout(() => callback(configurationData));
};

export const searchSymbols = async (
  userInput: any,
  exchange: any,
  symbolType: any,
  onResultReadyCallback: any,
) => {
  const symbolInfos = symbols.filter(
    (symbol) =>
      symbol.type === symbolType &&
      symbol.name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1,
  );
  console.log(symbolInfos);
  setTimeout(() => onResultReadyCallback(symbolInfos));
};

export const getBars = async (
  symbolInfo: any,
  resolution: any,
  periodParams: any,
  onHistoryCallback: any,
  onErrorCallback: any,
) => {
  const { countBack, from, to } = periodParams;

  const from_date = new Date(from * 1000).toISOString();
  const to_date = new Date(to * 1000).toISOString();

  const res = await fetch(
    `${REST_API_ENDPOINT}/candle/${resolutionMap[resolution]}/${symbolInfo.name}/${from_date}/${to_date}`,
  );

  const result = await res.json();

  const bars = [...result]
    .map((el) => ({ ...el, volume: Number(el.volume) }))
    .reverse();

  setTimeout(() => onHistoryCallback(bars));
};

export const subscribeBars = (
  symbolInfo: any,
  resolution: string,
  onRealtimeCallback: any,
  subscribeUID: any,
  onResetCacheNeededCallback: any,
) => {
  const socket = new WebSocket(
    `${WS_API_ENDPOINT}/candle/${resolutionMap[resolution]}/${symbolInfo.name}`,
  );

  channelToSubscription.set(subscribeUID, socket);

  socket.onopen = () => {
    console.log("[socket] Connected");
  };

  socket.onclose = (reason) => {
    console.log("[socket] Disconnected:", reason);
  };

  socket.onerror = (error) => {
    console.log("[socket] Error:", error);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const bar = {
      ...data,
    };
    onRealtimeCallback(bar);
  };
};

export const unsubscribeBars = (subscriberUID: any) => {
  console.log(subscriberUID);
  const socket = channelToSubscription.get(subscriberUID);
  if (socket) {
    socket.close();
    channelToSubscription.delete(subscriberUID);
  }
};
