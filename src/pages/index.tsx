import { OrderBook } from "@/component/Orderbook";
import { useOrderbook, useTrade } from "@/query";
import { OrderbookChunk } from "@/type";
import {
  getAccumulatedOrderbook,
  getSymbolList,
  orderbookToOrderbook,
} from "@/utils";
import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";

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
      <VStack p="50px" spacing="30px">
        <HStack w="full">
          <Select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            w="fit-content"
          >
            {symbolList.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </Select>
        </HStack>
        <HStack wrap="wrap" spacing="20px" justify="center">
          <VStack>
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
                  listLength={7}
                />
              </>
            )}
          </VStack>
          <VStack>
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
                  listLength={7}
                />
              </>
            )}
          </VStack>
          <VStack>
            {upbitOrderbook?.[symbol] && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Exchange3
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    upbitOrderbook[symbol].asks,
                    upbitOrderbook[symbol].bids,
                  )}
                  listLength={7}
                />
              </>
            )}
          </VStack>
        </HStack>

        <HStack spacing="20px">
          <VStack w="500px">
            <Text fontSize="xl" fontWeight={600}>
              Total
            </Text>
            <OrderBook
              book={orderbookToOrderbook(
                accumulatedOrderbook[symbol].asks,
                accumulatedOrderbook[symbol].bids,
              )}
              listLength={7}
            />
          </VStack>
          <VStack w="fit-content">
            <Input placeholder="수량" type="number" />
            <Button>Confirm</Button>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
