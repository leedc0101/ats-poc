import { OrderBook } from "@/component/Orderbook";
import { useOrderbook, useTrade } from "@/query";
import { ExecuteResponse, OrderbookChunk } from "@/type";
import { getSymbolList, orderbookToOrderbook } from "@/utils";
import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";

import { useState } from "react";
import JsonView from "@uiw/react-json-view";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [symbol, setSymbol] = useState<string>("BTC-KRW");
  const [executions, setExecutions] = useState<ExecuteResponse | undefined>(
    undefined,
  );
  const { data: orderbookData } = useOrderbook(symbol.split("-")[0]);

  if (!orderbookData) {
    return <div>Loading...</div>;
  }

  const orderbookChunk: OrderbookChunk = orderbookData.data;
  const {
    coinone: coinoneOrderbook,
    bithumb: bithumbOrderbook,
    upbit: upbitOrderbook,
  } = orderbookChunk.orderbook;

  const { merged } = orderbookChunk;

  const symbolList = getSymbolList();

  const onPostAsk = async () => {
    const response = await fetch("/api/route", {
      method: "POST",
      body: JSON.stringify({
        pair: symbol,
        is_bid: false,
        amount: Number(amount),
      }),
    });
    const res = await response.json();
    setExecutions(res.data);
  };
  const onPostBid = async () => {
    const response = await fetch("/api/route", {
      method: "POST",
      body: JSON.stringify({
        pair: symbol,
        is_bid: true,
        amount: Number(amount),
      }),
    });
    const res = await response.json();
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
            {bithumbOrderbook && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Bithumb
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    bithumbOrderbook.asks,
                    bithumbOrderbook.bids,
                  )}
                  listLength={7}
                />
              </>
            )}
          </VStack>
          <VStack>
            {coinoneOrderbook && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Coinone
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    coinoneOrderbook.asks,
                    coinoneOrderbook.bids,
                  )}
                  listLength={7}
                />
              </>
            )}
          </VStack>
          <VStack>
            {upbitOrderbook && (
              <>
                <Text fontSize="xl" fontWeight={600}>
                  Upbit
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    upbitOrderbook.asks,
                    upbitOrderbook.bids,
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
                Object.entries(merged.asks).reverse().map(([key, value]) => [
                  Number(key),
                  value,
                ]),
                Object.entries(merged.bids).reverse().map(([key, value]) => [
                  Number(key),
                  value,
                ]),
              )}
              listLength={10}
            />
          </VStack>
          <VStack w="fit-content">
            <Input
              placeholder="수량"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <HStack>
            <Button onClick={onPostAsk}>Ask</Button>
            <Button onClick={onPostBid}>Bid</Button>

            </HStack>
          </VStack>
        </HStack>

        {executions && (
          <>
            <HStack wrap="wrap" spacing="20px" justify="center">
              <VStack>
                <Text fontSize="xl" fontWeight={600}>
                  Bithumb
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    executions.raw_data.bithumb.asks,
                    executions.raw_data.bithumb.bids,
                  )}
                  listLength={7}
                />
              </VStack>
              <VStack>
                <Text fontSize="xl" fontWeight={600}>
                  Coinone
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    executions.raw_data.coinone.asks,
                    executions.raw_data.coinone.bids,
                  )}
                  listLength={7}
                />
              </VStack>
              {executions.raw_data.upbit && 

              <VStack>
                <Text fontSize="xl" fontWeight={600}>
                  Upbit
                </Text>
                  <OrderBook
                    book={orderbookToOrderbook(
                      executions.raw_data.upbit.asks,
                      executions.raw_data.upbit.bids,
                    )}
                    listLength={7}
                  />
              </VStack>
                }

            </HStack>

            <HStack spacing="20px">
              <VStack w="500px">
                <Text fontSize="xl" fontWeight={600}>
                  Total
                </Text>
                <OrderBook
                  book={orderbookToOrderbook(
                    Object.entries(executions.merged_data.asks).map(
                      ([key, value]) => [Number(key), value],
                    ),
                    Object.entries(executions.merged_data.bids).map(
                      ([key, value]) => [Number(key), value],
                    ),
                  )}
                  listLength={10}
                />
              </VStack>
              <VStack w="fit-content">
                <JsonView
                  collapsed={1}
                  value={executions}
                  enableClipboard={false}
                />
              </VStack>
            </HStack>
          </>
        )}
      </VStack>
    </>
  );
}
