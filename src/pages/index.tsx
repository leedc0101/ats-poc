import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const TVChartContainer = dynamic(
  () => import("../component/TradingView/TVChartContainer"),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <VStack p="50px" spacing="30px">
      <VStack w="full" minH="500px">
        <TVChartContainer />
      </VStack>
    </VStack>
  );
}
