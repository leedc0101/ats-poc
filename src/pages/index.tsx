import { useOrderbook, useTrade } from "@/query";
import { orderStyle } from "@/styles/orderbook";
import { OrderbookChunk } from "@/type";
import {
  getAccumulatedOrderbook,
  getSymbolList,
  orderbookToOrderbook,
} from "@/utils";
import { HStack, Select, Text, VStack } from "@chakra-ui/react";
import { OrderBook } from "@lab49/react-order-book";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState<string>("BTC-KRW");

  const { data: orderbookData } = useOrderbook();
  const { data: tradeData } = useTrade();

  if (!orderbookData || !tradeData) {
    return <div>Loading...</div>;
  }

  const orderbookChunk: OrderbookChunk = orderbookData.data;
  const {
    coinone: coinoneOrderbook,
    bithumb: bithumbOrderbook,
    upbit: upbitOrderbook,
  } = orderbookChunk;
  const symbolList = getSymbolList(orderbookChunk);

  const accumulatedOrderbook = getAccumulatedOrderbook(orderbookChunk);

  return (
    <>
      <style dangerouslySetInnerHTML={orderStyle} />
      <VStack p="50px" spacing="30px">
        <HStack w="full">
          <Select onChange={(e) => setSymbol(e.target.value)} w="fit-content">
            {symbolList.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </Select>
        </HStack>
        <HStack wrap="wrap" spacing="50px" justify="center">
          <VStack w="300px">
            {bithumbOrderbook?.[symbol] && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Exchange1
                </Text>
                <OrderBook
                  // @ts-ignore
                  book={orderbookToOrderbook(
                    bithumbOrderbook[symbol].asks,
                    bithumbOrderbook[symbol].bids,
                  )}
                  fullOpacity
                  interpolateColor={(color) => color}
                  listLength={5}
                  stylePrefix="MakeItNiceAgain"
                  showSpread={false}
                />
              </>
            )}
          </VStack>
          <VStack w="300px">
            {coinoneOrderbook?.[symbol] && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Exchange2
                </Text>
                <OrderBook
                  //@ts-ignore
                  book={orderbookToOrderbook(
                    coinoneOrderbook[symbol].asks,
                    coinoneOrderbook[symbol].bids,
                  )}
                  fullOpacity
                  interpolateColor={(color) => color}
                  listLength={5}
                  stylePrefix="MakeItNiceAgain"
                  showSpread={false}
                />
              </>
            )}
          </VStack>
          <VStack w="300px">
            {upbitOrderbook?.[symbol] && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Exchange3
                </Text>
                <OrderBook
                  //@ts-ignore
                  book={orderbookToOrderbook(
                    upbitOrderbook[symbol].asks,
                    upbitOrderbook[symbol].bids,
                  )}
                  fullOpacity
                  interpolateColor={(color) => color}
                  listLength={5}
                  stylePrefix="MakeItNiceAgain"
                  showSpread={false}
                />
              </>
            )}
          </VStack>
        </HStack>

        <VStack w="full" maxW="700px">
          <Text fontSize="xl" fontWeight={600}>
            Total
          </Text>
          <OrderBook
            //@ts-ignore
            book={orderbookToOrderbook(
              accumulatedOrderbook[symbol].asks,
              accumulatedOrderbook[symbol].bids,
            )}
            fullOpacity
            interpolateColor={(color) => color}
            listLength={5}
            stylePrefix="MakeItNiceAgain"
            showSpread={false}
          />
        </VStack>
      </VStack>
    </>
  );
}
