import { atom } from "recoil";

export const $selectedSymbol = atom({
  key: "selectedSymbol",
  default: "btc",
});
