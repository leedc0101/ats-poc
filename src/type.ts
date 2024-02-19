// 각 거래소의 orderbook
export type ExchangeOrderbook = {
    exchange: string;
    symbol: string;
    asks: [number, number][];
    bids: [number, number][];
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
  merged: {
    asks: { [key: string]: number }
    bids: { [key: string]: number }
    symbol: string;
    timestamp: number;
  };
  orderbook: {
    bithumb: ExchangeOrderbook;
    coinone: ExchangeOrderbook;
    upbit: ExchangeOrderbook;
  }
};

// /trade 엔드포인트 넘어오는 그대로
export type TradeChunk = {
  coinone: ExchangeTrade;
  bithumb: ExchangeTrade;
  upbit: ExchangeTrade;
};

export type PostOrderBody = {
  pair: string;
  is_bid: boolean;
  amount: number;
  price?: number;

}