// 각 거래소의 orderbook
export type ExchangeOrderbook = {
  [key: string]: {
    exchange: string;
    symbol: string;
    asks: [number, number][];
    bids: [number, number][];
  };
};

// 각 거래소의 trade
export type ExchangeTrade = {
  [key: string]: {
    exchange: string;
    price: number;
    qty: number;
    symbol: string;
    timestamp: number;
  };
};

// /orderbook 엔드포인트 넘어오는 그대로
export type OrderbookChunk = {
  coinone: ExchangeOrderbook;
  bithumb: ExchangeOrderbook;
  upbit: ExchangeOrderbook;
};

// /trade 엔드포인트 넘어오는 그대로
export type TradeChunk = {
  coinone: ExchangeTrade;
  bithumb: ExchangeTrade;
  upbit: ExchangeTrade;
};
