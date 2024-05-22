type CandleBase = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type ExchangeCandle = CandleBase & {
  time: number;
};

type CombinedCandle = CandleBase & {
  time: number;
  exchange_candles: Record<string, ExchangeCandle>;
};
