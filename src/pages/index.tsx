import { OrderBook } from "@/component/Orderbook";
import { useOrderbook, useTrade } from "@/query";
import { OrderbookChunk } from "@/type";
import {
  getSymbolList,
  orderbookToOrderbook,
} from "@/utils";
import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount ] = useState("");
  const [symbol, setSymbol] = useState<string>("BTC-KRW");
  const [executions, setExecutions] = useState([]);
  const { data: orderbookData } = useOrderbook(symbol.split('-')[0]);

  if (!orderbookData) {
    return <div>Loading...</div>;
  }

  const orderbookChunk: OrderbookChunk = orderbookData.data;
  const {
    coinone: coinoneOrderbook,
    bithumb: bithumbOrderbook,
    upbit: upbitOrderbook,
  } = orderbookChunk.orderbook;
  
  const { merged } = orderbookChunk
  
  console.log(coinoneOrderbook,  bithumbOrderbook, upbitOrderbook);
  const symbolList = getSymbolList();

  const onPost = async () => {
      const response = await fetch(
        "/api/route", {
          method: "POST",
          body: JSON.stringify({
            pair: symbol,
            is_bid: true,
            amount
          }),
        }
      )
      const res = await response.json()
      setExecutions(res.data);
  };

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
                  Bithumb
                </Text>
                <OrderBook
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
                  Coinone
                </Text>
                <OrderBook
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
                  Upbit
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
                Object.entries(merged.asks).map(([key, value]) => [Number(key), value]),
                Object.entries(merged.bids).map(([key, value]) => [Number(key), value]),
              )}
              listLength={10}
            />
          </VStack>
          <VStack w="fit-content">
            <Input placeholder="수량" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <Button onClick={onPost}>Confirm</Button>
          </VStack>
        </HStack>
      </VStack>
    </>
  );
}
