import { supported_resolutions } from "./config";

const commonSymbolInfo = {
  timezone: "Asia/Seoul",
  minmov: 1,
  minmov2: 0,
  pointvalue: 1,
  session: "24x7",
  has_intraday: true,
  has_no_volume: false,
  type: "crypto",
  supported_resolutions,
  exchange: "Test",
  has_weekly_and_monthly: false,
  volume_precision: 2,
  pricescale: 100,
};

export const symbols = [
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
