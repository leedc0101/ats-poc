import { REST_API_ENDPOINT, WS_API_ENDPOINT } from "@/constant";
import { configurationData } from "./config";

// const resolutionMap = {
//   1: "1m",
//   5: "5m",
//   15: "15m",
//   60: "1h",
//   240: "4h",
//   "1D": "1d",
// };

const channelToSubscription = new Map();

const commonSymbolInfo = {
  timezone: "Asia/Seoul",
  minmov: 1,
  minmov2: 0,
  pointvalue: 1,
  session: "24x7",
  has_intraday: true,
  has_no_volume: false,
  type: "crypto",
  supported_resolutions: ["1"],
  exchange: "Test",
  has_weekly_and_monthly: false,
  volume_precision: 2,
  pricescale: 100,
};

const symbols = [
  {
    name: "btc",
    description: "btc",
    symbol: "btc",
    full_name: "btc",
    ...commonSymbolInfo,
  },
  {
    name: "eth",
    description: "eth",
    symbol: "eth",
    full_name: "eth",
    ...commonSymbolInfo,
  },
];

const datafeed = {
  onReady: (callback: any) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
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
  },

  resolveSymbol: async (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    const symbolInfo = symbols.find((el) => symbolName === el.name);

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  },

  getBars: async (
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
      `${REST_API_ENDPOINT}/candle/${symbolInfo.name}/${from_date}/${to_date}`,
    );
    const result = await res.json();

    const bars = [...result].reverse();

    // if (bars.length !== 0) {
    //   if (Object.keys(lastBar).includes(symbolInfo.full_name)) {
    //     if (Object.keys(lastBar[symbolInfo.full_name]).includes(resolution)) {
    //       if (bars[bars.length - 1].time > lastBar[symbolInfo.full_name][resolution].time)
    //         lastBar[symbolInfo.full_name][resolution] = bars[bars.length - 1];
    //     } else {
    //       lastBar[symbolInfo.full_name][resolution] = bars[bars.length - 1];
    //     }
    //   } else {
    //     lastBar[symbolInfo.full_name] = {};
    //     lastBar[symbolInfo.full_name][resolution] = bars[bars.length - 1];
    //   }
    // }

    setTimeout(() => onHistoryCallback(bars));
  },

  subscribeBars: (
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscribeUID: any,
    onResetCacheNeededCallback: any,
  ) => {
    const socket = new WebSocket(
      `${WS_API_ENDPOINT}/candle/${symbolInfo.name}`,
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
  },

  unsubscribeBars: (subscriberUID: any) => {
    console.log(subscriberUID);
    const socket = channelToSubscription.get(subscriberUID);
    if (socket) {
      socket.close();
      channelToSubscription.delete(subscriberUID);
    }
  },
};

export default datafeed;
