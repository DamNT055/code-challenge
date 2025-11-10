import React, { useMemo, useCallback } from 'react';
import { BoxProps } from '@mui/material';
import WalletRow from './WalletRow';
import useWalletBalances from './useWalletBalances';
import usePrices from './usePrices';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property (type mismatch fix)
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props; // Removed unused `children`

  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   *  FIXED: moved getPriority outside of render computation
   * - Previously redeclared on every render (invalidating useMemo)
   * - Now wrapped in useCallback so reference is stable
   */
  const getPriority = useCallback((blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  }, []);

  /**
   *  FIXED: Corrected filter + sort logic
   *  FIXED: Removed unused dependency `prices`
   *  FIXED: Avoided redundant getPriority() calls with local caching
   *  OLD: called getPriority multiple times per item
   *  OLD: referenced undefined variable `lhsPriority`
   *  OLD: wrong filter kept zero balances instead of positive
   */
  const sortedBalances = useMemo(() => {
    // cache priorities locally to avoid recomputing
    const priorities = new Map<string, number>();

    const getCachedPriority = (blockchain: string) => {
      if (!priorities.has(blockchain)) {
        priorities.set(blockchain, getPriority(blockchain));
      }
      return priorities.get(blockchain)!;
    };

    return balances
      .filter((balance: WalletBalance) => {
        const priority = getCachedPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0; // ✅ fixed condition
      })
      .sort((lhs, rhs) => {
        const leftPriority = getCachedPriority(lhs.blockchain);
        const rightPriority = getCachedPriority(rhs.blockchain);
        return rightPriority - leftPriority; // higher priority first
      });
  }, [balances, getPriority]); // ✅ removed `prices` dependency

  /**
   *  FIXED: Combined formatting + row creation in one pass
   *  OLD: performed two separate .map() passes
   *  FIXED: Added stable key instead of array index
   *  FIXED: Added toFixed(2) for predictable formatting
   *  FIXED: Wrapped in useMemo to prevent recomputation on unrelated renders
   */
  const rows = useMemo(() => {
    return sortedBalances.map((balance) => {
      const formatted = balance.amount.toFixed(2);
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className="wallet-row"
          key={balance.currency} // ✅ stable key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      );
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
