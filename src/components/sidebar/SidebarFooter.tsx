import { css } from '@emotion/react';
import { EmailOutlined, Telegram } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { Twitter } from 'react-feather';

export const SidebarFooter = ({ ...rest }) => {
  return (
    <div
      css={(theme) => css`
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        gap: 0px;
        padding: 10px;
        background-color: ${theme.sidebar.background};
      `}
    >
      <Typography variant="body1" color="textSecondary" align="center">
        Any feedback or questions?
      </Typography>
      <div
        css={(theme) => css`
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 10px;
          padding: 20px;
          padding-top: 0;
          padding-bottom: 0;
          background-color: ${theme.sidebar.background};
        `}
      >
        <IconButton
          size="medium"
          onClick={() => window.open('https://twitter.com/warden_finance')}
        >
          <Twitter
            css={css`
              opacity: 70%;
            `}
            size="20px"
          />
        </IconButton>
        <IconButton
          size="medium"
          onClick={() => window.open('https://discord.com/invite/AfUqDrrjVT')}
        >
          <img
            css={css`
              opacity: 70%;
            `}
            src="/vendors/discord.svg"
            height="16px"
            alt="Discord"
          />
        </IconButton>
        <IconButton
          size="medium"
          onClick={() => window.open('https://t.me/shippooor')}
        >
          <Telegram
            css={css`
              opacity: 70%;
            `}
            fontSize="small"
          />
        </IconButton>
        <a href="mailto:contact@shippooor.xyz">
          <IconButton size="medium">
            <EmailOutlined
              css={css`
                opacity: 70%;
              `}
              fontSize="small"
            />
          </IconButton>
        </a>
      </div>
    </div>
  );
};
