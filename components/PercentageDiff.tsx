import React from 'react';

import { Span } from '@opencollective/frontend-components/components/Text';

export const PercentageDiff = ({ previousValue, newValue }) => {
  if (newValue === 0 || previousValue === 0 || newValue === previousValue) {
    return null;
  }

  const percentage = Math.round(((newValue - previousValue) / previousValue) * 100);
  if (!percentage) {
    return null;
  } else if (percentage > 0) {
    return (
      <Span color="green.700">
        <Span color="green.500">↑</Span> {percentage}%
      </Span>
    );
  } else {
    return (
      <Span color="red.700">
        <Span color="red.500">↓</Span> {percentage}%
      </Span>
    );
  }
};
