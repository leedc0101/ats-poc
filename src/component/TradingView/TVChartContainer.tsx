import { Box, useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
import { widget } from "../../../public/static/charting_library/charting_library.esm";
import { REST_API_ENDPOINT, WS_API_ENDPOINT } from "@/constant";
// @ts-ignore
import {
  getBars,
  onReady,
  searchSymbols,
  subscribeBars,
  unsubscribeBars,
} from "./datafeed";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  ResolveCallback,
} from "../../../public/static/charting_library/charting_library";
import { symbols } from "./constant";
import { useSetRecoilState } from "recoil";
import { $selectedSymbol } from "@/atom";

const TVChartContainer = () => {
  const [isSm] = useMediaQuery("(max-width: 800px)");

  const setSelectedSymbol = useSetRecoilState($selectedSymbol);

  const resolveSymbol = async (
    symbolName: any,
    onSymbolResolvedCallback: any,
    onResolveErrorCallback: any,
  ) => {
    const symbolInfo = symbols.find((el) => symbolName === el.name);

    setSelectedSymbol(symbolName);

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  };

  useEffect(() => {
    const tvWidgetOptions: ChartingLibraryWidgetOptions = {
      symbol: "btc", // default symbol
      container: "TVChartContainer",
      interval: "15" as ResolutionString,
      locale: "ko",
      fullscreen: false,
      autosize: true,
      datafeed: {
        getBars,
        onReady,
        resolveSymbol,
        searchSymbols,
        subscribeBars,
        unsubscribeBars,
      },
      library_path: "/static/charting_library/",
      timezone: "Asia/Seoul",

      charts_storage_url: REST_API_ENDPOINT,
      charts_storage_api_version: "1.1",
      client_id: "trading-dashboard.vegaxh.com",
      user_id: "general",
    };
    const tvWidget = new widget(tvWidgetOptions);
  }, []);

  return (
    <Box
      w="full"
      h={isSm ? "450px" : "700px"}
      id="TVChartContainer"
      boxShadow="xl"
    ></Box>
  );
};

export default TVChartContainer;
