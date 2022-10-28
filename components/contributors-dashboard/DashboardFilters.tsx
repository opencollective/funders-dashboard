import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { encodeDateInterval } from '@opencollective/frontend-components/lib/date-utils';

import PeriodFilter from '@opencollective/frontend-components/components/filters/PeriodFilter';
import { Flex } from '@opencollective/frontend-components/components/Grid';
import StyledButton from '@opencollective/frontend-components/components/StyledButton';
import { StyledSelectFilter } from '@opencollective/frontend-components/components/StyledSelectFilter';
import { Label } from '@opencollective/frontend-components/components/Text';

const FilterColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  flex: 1 1;
  & > label {
    text-transform: uppercase;
    color: #4d4f51;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    margin-bottom: 8px;
  }
`;

export const DashboardFilters = ({ filters, onChange }) => {
  const getFilterProps = (name, valueModifier) => ({
    inputId: `filter-${name}`,
    value: filters?.[name],
    onChange: value => {
      const preparedValue = valueModifier ? valueModifier(value) : value;
      onChange({ ...filters, [name]: value === 'ALL' ? null : preparedValue });
    },
  });

  return (
    <Flex alignItems="flex-end" justifyContent="space-between">
      <FilterColumn>
        <Label htmlFor="input-search">
          <FormattedMessage defaultMessage="Search" />
        </Label>
        {/* Todo: collective picker */}
        <StyledSelectFilter inputId="input-search" fontSize="10px" placeholder="Search by project" />
      </FilterColumn>
      <FilterColumn>
        <Label htmlFor="input-period">
          <FormattedMessage defaultMessage="Period" />
        </Label>
        <PeriodFilter {...getFilterProps('period', encodeDateInterval)} minDate="2020-01-01" />
      </FilterColumn>
      <FilterColumn>
        <Label htmlFor="input-sort-by">
          <FormattedMessage defaultMessage="Sort by" />
        </Label>
        {/* Todo: styled select */}
        <StyledSelectFilter inputId="input-sort-by" fontSize="10px" placeholder="Latest contributions" />
      </FilterColumn>
      <StyledButton buttonStyle="primary" buttonSize="small" py="8px">
        <FormattedMessage defaultMessage="Download CSV" />
      </StyledButton>
    </Flex>
  );
};
