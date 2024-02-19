import { ExchangeOrderbook, OrderbookChunk } from "./type";

// /orderbook 엔드포인트에서 SymbolList를 가져오는 함수
export const getSymbolList = (orderbook: OrderbookChunk) => {
  const list: string[] = [];
  Object.values(orderbook).forEach((exchangeOrderbook) => {
    Object.keys(exchangeOrderbook).forEach((symbol) => {
      list.push(symbol);
    });
  });

  return Array.from(new Set(list));
};

// Bid 가격 순으로 정렬
export const orderBids = (a: [number, number], b: [number, number]) => {
  return b[0] - a[0];
};

// Ask 가격 순으로 정렬
export const orderAsks = (a: [number, number], b: [number, number]) => {
  return a[0] - b[0];
};

// orderbook을 받아서 가격순으로 정렬하고 상위 5개만 리턴
export const orderbookToOrderbook = (
  asks: [number, number][],
  bids: [number, number][],
) => {
  const sortedAsks = asks.sort(orderAsks);
  const sortedBids = bids.sort(orderBids);
  return {
    asks: sortedAsks,
    bids: sortedBids,
  };
};

// orderbook chunk를 받아서 각 거래소의 동일 가격의 주문량을 합쳐서 리턴
export const getAccumulatedOrderbook = (
  orderbook: OrderbookChunk,
): ExchangeOrderbook => {
  const accumulatedOrderbook: ExchangeOrderbook = {
    "BTC-KRW": {
      exchange: "accumulated",
      symbol: "BTC-KRW",
      asks: [],
      bids: [],
    },
    "USDT-KRW": {
      exchange: "accumulated",
      symbol: "USDT-KRW",
      asks: [],
      bids: [],
    },
  };

  Object.values(orderbook).forEach((exchangeOrderbook) => {
    Object.entries(exchangeOrderbook).forEach(([symbol, orderbook]) => {
      const { asks, bids } = orderbook;
      asks.forEach(([price, qty]) => {
        const accumulatedAsk = accumulatedOrderbook[symbol].asks.find(
          (ask) => ask[0] === price,
        );
        if (accumulatedAsk) {
          accumulatedAsk[1] += qty;
        } else {
          accumulatedOrderbook[symbol].asks.push([price, qty]);
        }
      });
      bids.forEach(([price, qty]) => {
        const accumulatedBid = accumulatedOrderbook[symbol].bids.find(
          (bid) => bid[0] === price,
        );
        if (accumulatedBid) {
          accumulatedBid[1] += qty;
        } else {
          accumulatedOrderbook[symbol].bids.push([price, qty]);
        }
      });
    });
  });

  return accumulatedOrderbook;
};
