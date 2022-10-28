import React from 'react';
import { gql } from '@apollo/client';
import { uniqBy } from 'lodash';
import type { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { initializeApollo } from '../../lib/apollo-client';
import { Amount } from '../../lib/graphql/types/v2/graphql';
import { useLoggedInUser } from '../../lib/hooks/useLoggedInUser';
import { parseDateInterval } from '@opencollective/frontend-components/lib/date-utils';

import { DashboardFilters } from '../../components/contributors-dashboard/DashboardFilters';
import Layout from '../../components/Layout';
import { PercentageDiff } from '../../components/PercentageDiff';
import Avatar from '@opencollective/frontend-components/components/Avatar';
import Container from '@opencollective/frontend-components/components/Container';
import { Box } from '@opencollective/frontend-components/components/Grid';
import LoadingPlaceholder from '@opencollective/frontend-components/components/LoadingPlaceholder';
import StyledLink from '@opencollective/frontend-components/components/StyledLink';
import { P, Span } from '@opencollective/frontend-components/components/Text';

const formatAmount = ({ value, currency }: Amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead {
    tr {
      th {
        padding-bottom: 32px;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
        color: #4d4f51;
      }
    }
  }
  tbody {
    td {
      text-align: center;
      font-size: 16px;
      line-height: 18px;
      color: #323334;
      padding: 16px 0;
      border-top: 1px solid #eaeaec;
      &:first-child {
        padding-left: 16px;
      }
      &:last-child {
        padding-right: 16px;
      }
    }
  }
`;

const funderQuery = gql`
  query ContributorsDashboard($slug: String, $dateFrom: DateTime, $dateTo: DateTime) {
    account(slug: $slug) {
      slug
      name
      memberOf(role: BACKER, orderBy: { field: TOTAL_CONTRIBUTED, direction: DESC }) {
        nodes {
          id
          account {
            slug
            name
            imageUrl(height: 80)
            stats {
              totalAmountReceivedPastMonth: totalAmountReceived(
                dateFrom: $dateFrom
                dateTo: $dateTo
                includeChildren: true
              ) {
                value
                currency
              }
              totalAmountSpentPastMonth: totalAmountSpent(dateFrom: $dateFrom, dateTo: $dateTo, includeChildren: true) {
                value
                currency
              }
              totalAmountReceivedPreviousMonth: totalAmountReceived(
                dateFrom: $dateFrom
                dateTo: $dateTo
                includeChildren: true
              ) {
                value
                currency
              }
              totalAmountSpentPreviousMonth: totalAmountSpent(
                dateFrom: $dateFrom
                dateTo: $dateTo
                includeChildren: true
              ) {
                value
                currency
              }
              balance(includeChildren: true) {
                value
                currency
              }
              activeMonthlyRecurringContributions: activeRecurringContributionsV2(frequency: MONTHLY) {
                value
                currency
              }
              activeYearlyRecurringContributions: activeRecurringContributionsV2(frequency: YEARLY) {
                value
                currency
              }
            }
          }
          totalDonations {
            value
            currency
          }
        }
      }
    }
  }
`;

const getVariablesFromQuery = query => {
  const { from: dateFrom, to: dateTo } = parseDateInterval(query.period);
  return {
    slug: query.slug,
    offset: parseInt(query.offset) || 0,
    limit: parseInt(query.limit) || 100,
    dateFrom,
    dateTo,
  };
};

export async function getServerSideProps(context: NextPageContext) {
  const client = initializeApollo({ context });
  const variables = getVariablesFromQuery(context.query);
  const { data } = await client.query({ query: funderQuery, variables });
  return { props: { account: data.account } };
}

const calculateRecurring = node => {
  // TODO This doesn't really make sense with the period filter. Commenting rather than fixing since
  // filters are changing in the design.

  // let recurring;

  // if (scale === 'year') {
  //   recurring = { ...node.account.stats.activeYearlyRecurringContributions };
  //   if (node.account.stats.activeYearlyRecurringContributions) {
  //     recurring.value += Math.round(node.account.stats.activeMonthlyRecurringContributions.value * 12);
  //   }
  // } else {
  const recurring = { ...node.account.stats.activeMonthlyRecurringContributions };
  if (node.account.stats.activeYearlyRecurringContributions) {
    recurring.value += Math.round(node.account.stats.activeYearlyRecurringContributions.value / 12);
  }
  // }

  return recurring;
};

export default function ContributorDashboard({ account = null }) {
  const { LoggedInUser, loadingLoggedInUser } = useLoggedInUser();
  const router = useRouter();
  return (
    <Layout>
      <Container background="white" width="100%" pb="56px" px="40px">
        <Container display="flex" maxWidth="1280px" m="0 auto">
          <Box flex="0 1 550px" borderRight="2px solid #D9D9D9">
            <P fontSize="40px" fontWeight="300" mb="16px">
              {loadingLoggedInUser ? (
                <LoadingPlaceholder width="100%" height="46px" />
              ) : LoggedInUser ? (
                <FormattedMessage
                  defaultMessage="Hello, {name}!"
                  values={{ name: LoggedInUser.collective.name.split(' ')[0] }}
                />
              ) : null}
            </P>
            <P fontSize="18px">
              <FormattedMessage defaultMessage="Follow up on the projects you contribute to, and manage your contribution portfolio with simplicity and transparency. " />
            </P>
          </Box>
          <Container width="2px" background="#D9D9D9" mx="40px" />
          <Box>
            <P textTransform="uppercase" fontSize="18px" fontWEight="400" color="black.900" mb="16px">
              <FormattedMessage defaultMessage="Amount funded" />
            </P>
            <P fontSize="28px" fontWeight="500" color="black.900" mb="16px">
              $13,456.05 USD
            </P>
            <P fontSize="18px">
              <FormattedMessage defaultMessage="To {count} Collectives" values={{ count: 36 }} />
            </P>
          </Box>
        </Container>
      </Container>
      <Container px="40px" py="48px" maxWidth={1280 + 40 * 2} m="0 auto">
        <Container background="white" px="32px" py="24px" borderRadius="16px">
          <Container mb="48px">
            <DashboardFilters
              filters={router.query}
              onChange={queryParams =>
                router.push({ pathname: router.pathname, query: { ...router.query, ...queryParams } })
              }
            />
          </Container>
          <Table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Collective</th>
                <th>Contributed</th>
                <th>Received</th>
                <th>Spent</th>
                <th>Recurring contributions</th>
                <th>Current Balance</th>
              </tr>
            </thead>
            <tbody>
              {account?.memberOf?.nodes &&
                uniqBy(account?.memberOf.nodes, node => node.account.slug).map(node => (
                  <tr key={node.id}>
                    <td>
                      <Avatar radius={40} collective={node.account} />
                    </td>
                    <td>
                      <StyledLink
                        href={`https://opencollective.com/${node.account.slug}`}
                        openInNewTab
                        color="black.800"
                      >
                        {node.account.name}
                      </StyledLink>
                    </td>
                    <td style={{ textAlign: 'center' }}>{formatAmount(node.totalDonations)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(node.account.stats.totalAmountReceivedPastMonth)}
                      <Span fontSize="14px" ml="8px">
                        <PercentageDiff
                          previousValue={node.account.stats.totalAmountReceivedPreviousMonth.value}
                          newValue={node.account.stats.totalAmountReceivedPastMonth.value}
                        />
                      </Span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {formatAmount(node.account.stats.totalAmountSpentPastMonth)}
                      <Span fontSize="14px" ml="8px">
                        <PercentageDiff
                          previousValue={node.account.stats.totalAmountSpentPreviousMonth.value}
                          newValue={node.account.stats.totalAmountSpentPastMonth.value}
                        />
                      </Span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{formatAmount(calculateRecurring(node))}</td>
                    <td style={{ textAlign: 'center' }}>{formatAmount(node.account.stats.balance)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {!account?.memberOf?.nodes && <p>No data.</p>}
        </Container>
      </Container>
    </Layout>
  );
}
