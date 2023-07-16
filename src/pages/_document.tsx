import { CacheProvider, css } from '@emotion/react';
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />
          <meta
            name="keywords"
            content="1inch,info,dex,aggregator,analytics,blockchain,web3,finance,warden,shippooor,risk,crypto"
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
                url: 'https://i.imgur.com/ZaLvku1.png', // TODO: Change this
                width: 1008,
                height: 560,
                type: 'image/jpeg',
                alt: '1inch Info Banner',
              },
            ],
            locale: 'en',
          }}
          twitter={{
            handle: '@1inch',
            site: 'https://twitter.com/1inch',
            cardType: 'summary_large_image',
          }}
        />
        <body
          css={css`
            overflow-x: hidden;
            // background-image: url(card-bg-4.svg);
            // background-size: cover;
            // background-repeat: no-repeat;
            // ::before {
            //   content: '';
            //   z-index: -1;
            //   position: fixed;
            //   width: 1146px;
            //   height: 1146px;
            //   right: -750px;
            //   top: 50px;
            //   background: radial-gradient(
            //     50% 50% at 50% 50%,
            //     rgba(74, 39, 74, 0.74) 0%,
            //     rgba(76, 38, 73, 0) 100%
            //   );
            // }
            // ::after {
            //   content: '';
            //   z-index: -1;
            //   position: fixed;
            //   width: 1228px;
            //   height: 1228px;
            //   left: -742px;
            //   top: -50px;
            //   background: radial-gradient(
            //     50% 50% at 50% 50%,
            //     rgba(40, 94, 176, 0.41) 0%,
            //     rgba(6, 19, 31, 0) 100%
            //   );
            }
          `}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
