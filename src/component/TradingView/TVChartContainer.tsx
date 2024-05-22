import { Box, useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
import { widget } from "../../../public/static/charting_library/charting_library.esm";
import { REST_API_ENDPOINT, WS_API_ENDPOINT } from "@/constant";
// @ts-ignore
import Datafeed from "./datafeed";

const TVChartContainer = () => {
  const [isSm] = useMediaQuery("(max-width: 800px)");

  useEffect(() => {
    const tvWidget = new widget({
      symbol: "btc", // default symbol
      container: "TVChartContainer",
      interval: "1",
      fullscreen: false,
      autosize: true,
      datafeed: Datafeed,
      library_path: "/static/charting_library/",
      timezone: "Asia/Seoul",

      charts_storage_url: REST_API_ENDPOINT,
      charts_storage_api_version: "1.1",
      client_id: "trading-dashboard.vegaxh.com",
      user_id: "general",
    });
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
