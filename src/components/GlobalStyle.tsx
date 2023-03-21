import { css, Global } from '@emotion/react';

const GlobalStyle = (props: any) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }

      a {
        color: rgba(255, 255, 255);
      }

      .highcharts-markers.highcharts-scatter-series image {
        transform: translate(-12px, -200px) !important;
      }
    `}
  />
);

export default GlobalStyle;
