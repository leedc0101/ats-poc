export const supported_resolutions = ["1", "5", "15", "30", "60", "240", "1D"];
export const resolutionMap: Record<any, any> = {
  1: "1m",
  5: "5m",
  15: "15m",
  30: "30m",
  60: "1h",
  240: "4h",
  "1D": "1d",
};

export type SupportedResolutions =
  | "1"
  | "5"
  | "15"
  | "30"
  | "60"
  | "240"
  | "1D";

export const configurationData = {
  supported_resolutions,
  exchanges: [
    {
      value: "TEST",
      name: "TEST",
      desc: "TEST",
    },
  ],
  symbols_types: [
    {
      name: "crypto",
      value: "crypto",
    },
  ],
};
