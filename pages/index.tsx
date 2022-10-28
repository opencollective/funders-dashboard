import React from 'react';
import Link from 'next/link';

import Layout from '../components/Layout';
import Container from '@opencollective/frontend-components/components/Container';
import StyledCard from '@opencollective/frontend-components/components/StyledCard';

export default function IndexPage() {
  return (
    <Layout>
      <Container p={4}>
        <StyledCard py={3} px={4}>
          <p>Examples:</p>
          <ul>
            <li>
              <Link href="/funders-dashboard/vercel">Vercel</Link>
            </li>
            <li>
              <Link href="/funders-dashboard/airbnb">Airbnb</Link>
            </li>
            <li>
              <Link href="/funders-dashboard/indeed">Indeed</Link>
            </li>
            <li>
              <Link href="/funders-dashboard/fbopensource">FB Open Source</Link>
            </li>
          </ul>
        </StyledCard>
      </Container>
    </Layout>
  );
}
