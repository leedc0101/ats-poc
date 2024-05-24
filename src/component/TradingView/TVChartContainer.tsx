import { Box, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { widget } from "../../../public/static/charting_library/charting_library.esm";
import { REST_API_ENDPOINT } from "@/constant";
// @ts-ignore
import {
  getBars,
  onReady,
  searchSymbols,
  subscribeBars,
  unsubscribeBars,
  resolveSymbol,
} from "./datafeed";
import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
} from "../../../public/static/charting_library/charting_library";
import { useSetRecoilState } from "recoil";
import { $selectedSymbol } from "@/atom";

const TVChartContainer = () => {
  const [isSm] = useMediaQuery("(max-width: 800px)");
  const setSelectedSymbol = useSetRecoilState($selectedSymbol);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const updateTextContent = () => {
      // Find the iframe
      const iframe: any = document.querySelector('iframe[id^="tradingview_"]');

      if (iframe) {
        const iframeDocument = iframe.contentWindow.document.body;

        // Find the target element inside the iframe
        const element = iframeDocument.querySelector(
          'div[class*="title1st"][class*="apply-overflow-tooltip"]',
        );

        if (element) {
          const text = element.textContent || element.innerText;
          setSelectedSymbol(text);
        }
      }
    };

    updateTextContent();

    // Create a MutationObserver to observe changes in the target element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          updateTextContent();
        }
      });
    });

    // Find the iframe and its document
    const iframe: any = document.querySelector('iframe[id^="tradingview_"]');

    if (iframe) {
      const iframeDocument = iframe.contentWindow.document;
      const targetElement = iframeDocument.querySelector(
        'div[class*="title1st"][class*="apply-overflow-tooltip"]',
      );

      if (targetElement) {
        // Start observing the target element for changes
        observer.observe(targetElement, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }

      // Cleanup the observer on component unmount
      return () => {
        if (targetElement) {
          observer.disconnect();
        }
      };
    }
  }, [isLoaded]); // Empty dependency array means this effect runs once after initial render

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
    tvWidget.onChartReady(() => {
      setIsLoaded(true);
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
