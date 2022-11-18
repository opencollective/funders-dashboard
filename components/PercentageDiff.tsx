import React from 'react';

import { formatAmount } from '../lib/amounts';

import { Span } from '@opencollective/frontend-components/components/Text';

export const PercentageDiff = ({ previousValue, newValue, currency }) => {
  let percentage;
  if (newValue && !previousValue) {
    percentage = 100;
  } else if (!newValue && previousValue) {
    percentage = -100;
  } else {
    percentage = Math.round(((newValue - previousValue) / previousValue) * 100);
  }

  if (!percentage) {
    return null;
  } else if (percentage > 0) {
    return (
      <Span color="green.700" title={`Previous period: ${formatAmount({ value: previousValue, currency })}`}>
        <Span color="green.500">↑</Span> {percentage}%
      </Span>
    );
  } else {
    return (
      <Span color="red.700" title={`Previous period: ${formatAmount({ value: previousValue, currency })}`}>
        <Span color="red.500">↓</Span> {percentage}%
      </Span>
    );
  }
};
