import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { DefaultSeo } from 'next-seo';

import { THEMES } from '@/constants';
import createEmotionCache from '@/shared/Rendering/Emotion';
import createTheme from '@/theme';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          const appProps = {
            ...props,
            emotionCache: cache,
          };

          return (
            <CacheProvider value={cache}>
              <ThemeProvider theme={createTheme(THEMES.DARK)}>
                <CssBaseline />
                <App {...appProps} />
              </ThemeProvider>
            </CacheProvider>
          );
        },
      });

    const page = await ctx.renderPage();

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents Emotion to render invalid HTML.
    // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags,
    };
  }

  render() {
    // @ts-ignore
    const { emotionStyleTags } = this.props;

    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="keywords"
            content="1inch,info,dex,aggregator,analytics,blockchain,web3,finance,warden,shippooor,risk,crypto"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=IBM Plex Mono&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto Mono&display=swap"
            rel="stylesheet"
          />
          <meta name="emotion-insertion-point" content="" />
          {emotionStyleTags}
        </Head>
        <DefaultSeo
          title="1inch Info | Analytics for 1inch DEX Aggregator"
          description="1inch Info is an analytics platform for 1inch DEX Aggregator. Explore protocol performance metrics, transactions and 1inch fusion mode. Powered by Warden Finance."
          canonical="https://info.inch.io/"
          openGraph={{
            url: 'https://info.inch.io/',
            title: '1inch Info | Analytics for 1inch DEX Aggregator',
            description:
              '1inch Info is an analytics platform for 1inch DEX Aggregator. Explore protocol performance metrics, transactions and 1inch fusion mode. Powered by Warden Finance.',
            siteName: '1inch Info',
            images: [
              {
                url: 'https://i.imgur.com/2hfmY8X.jpg', // TODO: Change this
                width: 1024,
                height: 512,
                type: 'image/jpeg',
                alt: '1inch Info Banner',
              },
            ],
            locale: 'en',
          }}
          twitter={{
            handle: '@warden_finance',
            site: 'https://twitter.com/warden_finance',
            cardType: 'summary_large_image',
          }}
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
