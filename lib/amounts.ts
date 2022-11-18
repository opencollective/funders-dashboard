import { Amount } from './graphql/types/v2/graphql';

export const formatAmount = ({ value, currency }: Amount, abs = false) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    abs ? Math.abs(value) : value,
  );
};
