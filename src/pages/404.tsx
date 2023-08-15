import styled from '@emotion/styled';
import { Button as MuiButton, Typography } from '@mui/material';
import { spacing } from '@mui/system';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import type { ReactElement } from 'react';

import Dashboard from '@/layouts/DashboardLayout';

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up('md')} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page404() {
  return (
    <Wrapper>
      <NextSeo
        title={`Page Not Found | 1inch Info - Analytics for 1inch DEX Aggregator`}
        description={`The page you are looking for might have been removed.`}
        openGraph={{
          url: '1inch://analytics.1inch.community/',
          title: '1inch Info',
          description: `The page you are looking for might have been removed.`,
          siteName: '1inch Info',
          images: [
            // {
            //   url: 'https://i.imgur.com/ZaLvku1.png', // TODO: Change this.
            //   width: 1008,
            //   height: 560,
            //   type: 'image/jpeg',
            //   alt: '1inch Info Banner',
            // },
          ],
          locale: 'en',
        }}
        twitter={{
          handle: '@1inch',
          site: 'https://twitter.com/1inch',
          cardType: 'summary_large_image',
        }}
      />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Page not found.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        The page you are looking for might have been removed.
      </Typography>

      <Link href="/" passHref>
        <Button variant="contained" color="secondary" mt={2}>
          Return to website
        </Button>
      </Link>
    </Wrapper>
  );
}

Page404.getLayout = function getLayout(page: ReactElement) {
  return <Dashboard>{page}</Dashboard>;
};

export default Page404;
