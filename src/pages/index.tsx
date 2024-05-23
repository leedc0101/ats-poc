import { $selectedSymbol } from "@/atom";
import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRecoilValue } from "recoil";

const TVChartContainer = dynamic(
  () => import("../component/TradingView/TVChartContainer"),
  {
    ssr: false,
  },
);

export default function Home() {
  const symbol = useRecoilValue($selectedSymbol);
  console.log(symbol);

  return (
    <VStack p="50px" spacing="30px">
      <VStack w="full" minH="500px">
        <TVChartContainer />
      </VStack>
    </VStack>
  );
}
