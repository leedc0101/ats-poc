import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

type PriceList = [number, number][];
// This would be [number, number, number], but:
// See: https://github.com/microsoft/TypeScript/issues/6574
type RgbColor = number[];

interface OrderBookStructure {
  asks: PriceList;
  bids: PriceList;
}

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type ExcludeRequiredProps<T> = Pick<T, OptionalKeys<T>>;

export enum Layout {
  Row = "row",
  Column = "column",
}

export interface Props {
  /**
   * For the internaly calculated colors, apply a background-color in the DOM.
   */
  applyBackgroundColor?: boolean;
  /**
   * Base color for the asks list.
   */
  askColor?: RgbColor;
  /**
   * Base color for the bids list.
   */
  bidColor?: RgbColor;
  /**
   * Order book object.
   */
  book: OrderBookStructure;
  /**
   * Use a value of 1 for the opacity of each row's generated color.
   */
  fullOpacity?: boolean;
  /**
   * Various layout options.
   */
  layout?: Layout;
  /**
   * Limit the length of the rendered bids and asks.
   */
  listLength?: number;
  /**
   * Show column headers.
   */
  showHeaders?: boolean;
  /**
   * Show the spread.
   */
  showSpread?: boolean;
  /**
   * Provide a custom spread value instead of letting OrderBook calculate it.
   */
  spread?: string;
  /**
   * Prefix for the CSS class name in the DOM.
   */
  stylePrefix?: string;
}

/**
 * Default props.
 */
const defaultProps: Omit<Required<ExcludeRequiredProps<Props>>, "spread"> & {
  spread?: string;
} = {
  applyBackgroundColor: false,
  askColor: [235, 64, 52],
  bidColor: [0, 216, 101],
  fullOpacity: false,
  layout: Layout.Column,
  listLength: 10,
  showHeaders: false,
  showSpread: true,
  spread: undefined,
  stylePrefix: "rob_OrderBook",
};

type RenderListOptions = {
  maxSize: number;
  type: "bid" | "ask";
};

/**
 * Render a list representing one side of an order book.
 */
const renderList = (list: PriceList, { maxSize, type }: RenderListOptions) => {
  return (
    <>
      {(type === "bid" ? [...list].reverse() : [...list]).map(
        ([price, size], index) => {
          const last = index === list.length - 1;

          return (
            <>
              {type === "ask" ? (
                <HStack position="relative" w="100px">
                  <Box
                    w={`${(size / maxSize) * 100}%`}
                    h="full"
                    position="absolute"
                    right={0}
                    bg="rgb(15, 41, 44)"
                  />
                  <Text
                    h="20px"
                    zIndex={2}
                    borderTop="1px solid rgb(46,47,58)"
                    borderBottom={last ? "1px solid rgb(46,47,58)" : "none"}
                    px="5px"
                    w="full"
                    align="right"
                    fontSize="11px"
                  >
                    {+size.toFixed(8)}
                  </Text>
                </HStack>
              ) : (
                <div />
              )}

              <Text
                borderLeft="1px solid rgb(46,47,58)"
                borderTop="1px solid rgb(46,47,58)"
                borderBottom={last ? "1px solid rgb(46,47,58)" : "none"}
                px="10px"
                w="100px"
                textAlign="center"
                h="20px"
              >
                {price.toLocaleString()}
              </Text>

              {type === "bid" ? (
                <HStack position="relative" w="100px">
                  <Box
                    w={`${(size / maxSize) * 100}%`}
                    h="full"
                    bg="rgb(58, 36, 37)"
                    position="absolute"
                    left={0}
                  />
                  <Text
                    h="20px"
                    zIndex={2}
                    borderLeft="1px solid rgb(46,47,58)"
                    borderTop="1px solid rgb(46,47,58)"
                    borderBottom={last ? "1px solid rgb(46,47,58)" : "none"}
                    px="5px"
                    w="full"
                    fontSize="11px"
                  >
                    {+size.toFixed(6)}
                  </Text>
                </HStack>
              ) : (
                <div />
              )}
            </>
          );
        },
      )}
    </>
  );
};

/**
 * OrderBook component.
 *
 * `react-order-book` is a simple, flexible order book component.
 * Pass in an order book as a prop, and cutomize the look and feel
 * with plenty of configuration options, plus numerous styling hooks
 * for visual customization.
 *
 * `react-order-book` tries to be extremely unopinionated about
 * styling, and as such, includes very little actual style rules.
 * There's plenty of examples in the included demo website that show
 * how you can use the rendered class names to create your own
 * beautiful experiences.
 *
 * This component is perfect for:
 *
 * - Trading platforms
 * - Order entry systems
 * - Dashboards
 */
export const Orderbook: React.FC<Props> = ({ book, listLength }) => {
  const { bids, asks } = book;

  const limitedAsks = asks.slice(0, listLength);
  const limitedBids = bids.slice(0, listLength);

  return (
    <HStack
      fontSize="13px"
      bg="rgb(23,24,36)"
      color="rgb(185, 189, 183)"
      py="30px"
      spacing={0}
      w="300px"
    >
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        {renderList(limitedAsks, {
          maxSize: limitedAsks.reduce(
            (acc, [_, size]) => (acc > size ? acc : size),
            0,
          ),
          type: "ask",
        })}
        {renderList(limitedBids, {
          maxSize: limitedBids.reduce(
            (acc, [_, size]) => (acc > size ? acc : size),
            0,
          ),
          type: "bid",
        })}
      </Grid>
    </HStack>
  );
};

Orderbook.defaultProps = defaultProps;
