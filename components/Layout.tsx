import React from 'react';
import styled from 'styled-components';

import Footer from './Footer';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const Main = styled.main`
  background: ${props => props.theme.colors.black[50]};
  min-height: 380px;
`;

export default function Layout({ children }: Props) {
  return (
    <React.Fragment>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </React.Fragment>
  );
}
