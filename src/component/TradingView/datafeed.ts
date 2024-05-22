import { REST_API_ENDPOINT } from "@/constant";
import { configurationData } from "./config";

// const resolutionMap = {
//   1: "1m",
//   5: "5m",
//   15: "15m",
//   60: "1h",
//   240: "4h",
//   "1D": "1d",
// };

// const intervalMap = {};
// const lastBar = {};

const symbols = [
  { name: "btc", type: "crypto" },
  { name: "eth", type: "crypto" },
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
    setTimeout(() => onResultReadyCallback(symbolInfos));
  },

  resolveSymbol: async (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    const symbolInfo = symbols.find((el) => symbolName === el.name);

    // setTimeout(() => onSymbolResolvedCallback(symbolInfo));
    setTimeout(() =>
      onSymbolResolvedCallback({
        name: symbolName,
        ticker: symbolName,
        timezone: "Asia/Seoul",
        minmov: 1,
        minmov2: 0,
        pointvalue: 1,
        session: "24x7",
        has_intraday: true,
        has_no_volume: false,
        description: symbolName,
        type: "crypto",
        supported_resolutions: ["1"],
      }),
    );
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

    console.log(from_date, to_date);

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
  ) => {},

  unsubscribeBars: (subscriberUID: any) => {
    // clearInterval(intervalMap[subscriberUID]);
  },
};

export default datafeed;
