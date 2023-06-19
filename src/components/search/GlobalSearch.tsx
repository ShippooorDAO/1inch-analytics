import { css, Interpolation, Theme } from '@emotion/react';
import {
  Card,
  CardContent,
  CardProps,
  ClickAwayListener,
  Fade,
  InputBase,
  InputBaseProps,
  Popper,
  Typography,
  useTheme,
} from '@mui/material';
import { useTheme as useMuiSystemTheme } from '@mui/system';
import Link from 'next/link';
import { rgba } from 'polished';
import React, { useEffect, useState } from 'react';
import { Search as SearchIcon } from 'react-feather';

import { Asset } from '@/shared/Model/Asset';
import { Chain } from '@/shared/Model/Chain';
import { useOneInchAnalyticsAPIContext } from '@/shared/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

import { RoundedImageIcon } from '../icons/RoundedImageIcon';
import { SlimAssetTableCell } from '../table/SlimAssetTableCell';

export interface SearchInputProps extends InputBaseProps {
  rootProps?: React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement> & {
      css?: Interpolation<Theme>;
    };
}

export function SearchInput({ rootProps, ...props }: SearchInputProps) {
  const muiSystemTheme = useMuiSystemTheme();
  const theme = useTheme();

  const { css: rootCss, ...rootPropsNoCss } = { ...rootProps };

  return (
    <div
      css={[
        css`
          border-radius: 10px;
          border: 1px solid ${rgba(theme.palette.text.primary, 0.1)};
          background-color: ${rgba(
            muiSystemTheme.palette.material.primary[500],
            0.3
          )};
          display: block;
          position: relative;
          width: 100%;
          &:hover {
            background-color: ${rgba(
              muiSystemTheme.palette.material.primary[500],
              0.4
            )};
            outline-offset: -2px;
            border: 1px solid ${rgba(theme.palette.text.primary, 0.3)};
            outline: 2px solid ${rgba(theme.palette.text.primary, 0.3)};
          }
        `,
        rootCss,
      ]}
      {...rootPropsNoCss}
    >
      <div
        css={css`
          width: 50px;
          height: 100%;
          position: absolute;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 22px;
            height: 22px;
          }
        `}
      >
        <SearchIcon />
      </div>
      <InputBase
        css={css`
          width: 100%;
          font-size: ${theme.typography.h6.fontSize};
          > input {
            color: ${theme.palette.text.primary};
            padding-top: ${theme.spacing(2.5)};
            padding-right: ${theme.spacing(2.5)};
            padding-bottom: ${theme.spacing(2.5)};
            padding-left: ${theme.spacing(12)};
          }
        `}
        {...props}
      />
    </div>
  );
}

interface SearchResultRowProps {
  children: React.ReactNode;
}

function SearchResultRow({ children }: SearchResultRowProps) {
  const muiSystemTheme = useMuiSystemTheme();

  return (
    <div
      css={css`
        border-radius: 10px;
        padding: 5px;
        &:hover {
          background-color: ${muiSystemTheme.palette.material
            .analogousPrimary[700]};
        }
        cursor: pointer;
      `}
    >
      {children}
    </div>
  );
}

interface ChainsSearchResultRowProps {
  chainName: string;
  chainImageUrl: string;
  description: string;
  href: string;
  onResultClick?: (e: React.MouseEvent) => void;
}

function ChainsSearchResultRow({
  chainName,
  chainImageUrl,
  description,
  href,
  onResultClick,
}: ChainsSearchResultRowProps) {
  return (
    <SearchResultRow>
      <Link prefetch={false} href={href}>
        <div
          onClick={onResultClick}
          css={css`
            display: flex;
            flex-flow: row;
            align-items: center;
            gap: 10px;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-flow: row;
              align-items: center;
              gap: 10px;
            `}
          >
            <RoundedImageIcon src={chainImageUrl} size="small" />
            <Typography variant="body2" color="textPrimary">
              {chainName}
            </Typography>
          </div>
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </div>
      </Link>
    </SearchResultRow>
  );
}

interface ChainsSearchResultsProps {
  chains?: Chain[];
  onResultClick?: (e: React.MouseEvent) => void;
}

function ChainsSearchResults({
  chains,
  onResultClick,
}: ChainsSearchResultsProps) {
  if (!chains || chains.length === 0) {
    return null;
  }

  const rows = [
    ...chains.map((chain) => {
      return (
        <ChainsSearchResultRow
          key={`${chain.name}1`}
          chainName={chain.displayName}
          chainImageUrl={chain.imageUrl}
          description="Overview"
          href={`/?chain=${chain.name}`}
          onResultClick={onResultClick}
        />
      );
    }),
    ...chains.map((chain) => {
      return (
        <ChainsSearchResultRow
          key={`${chain.name}2`}
          chainName={chain.displayName}
          chainImageUrl={chain.imageUrl}
          description="Transactions"
          href={`/transactions?chain=${chain.name}`}
          onResultClick={onResultClick}
        />
      );
    }),
  ];
  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        gap: 10px;
      `}
    >
      <Typography variant="h5">Chains</Typography>
      <div
        css={css`
          display: flex;
          flex-flow: column;
        `}
      >
        {rows.slice(0, 3)}
      </div>
    </div>
  );
}

interface AssetSearchResultRowProps {
  asset: Asset;
  href: string;
  description: string;
  onResultClick?: (e: React.MouseEvent) => void;
}

function AssetSearchResultRow({
  asset,
  href,
  description,
  onResultClick,
}: AssetSearchResultRowProps) {
  return (
    <SearchResultRow>
      <Link prefetch={false} href={href}>
        <div
          onClick={onResultClick}
          css={css`
            display: flex;
            flex-flow: row;
            align-items: center;
            gap: 10px;
          `}
        >
          <SlimAssetTableCell asset={asset} />
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        </div>
      </Link>
    </SearchResultRow>
  );
}

interface AssetsSearchResultsProps {
  assets?: Asset[];
  onResultClick?: (e: React.MouseEvent) => void;
}

function AssetsSearchResults({
  assets,
  onResultClick,
}: AssetsSearchResultsProps) {
  const { assetService } = useOneInchAnalyticsAPIContext();

  if (!assets || assets.length === 0 || !assetService) {
    return null;
  }

  const rows = assets.reduce((accumulator, asset) => {
    accumulator.push(
      <AssetSearchResultRow
        key={`${asset.id}`}
        href={`/transactions?assetIds=${asset.symbol}`}
        asset={asset}
        description="Transactions"
        onResultClick={onResultClick}
      />
    );

    return accumulator;
  }, new Array<React.ReactNode>());

  if (rows.length === 0) {
    return null;
  }

  return (
    <div
      css={css`
        display: flex;
        flex-flow: column;
        gap: 10px;
      `}
    >
      <Typography variant="h5">Assets</Typography>
      <div
        css={css`
          display: flex;
          flex-flow: column;
        `}
      >
        {rows.slice(0, 5)}
      </div>
    </div>
  );
}

type SearchResultsCardProps = {
  searchResults?: SearchResults;
  onResultClick?: (e: React.MouseEvent) => void;
} & CardProps;

function SearchResultsCard({
  searchResults,
  onResultClick,
  ...props
}: SearchResultsCardProps) {
  const theme = useTheme();

  if (!searchResults || searchResults.loading) {
    return (
      <Card
        {...props}
        css={css`
          z-index: 9999999;
          min-width: 500px;
          backdrop-filter: blur(20px);
          background-color: ${rgba(theme.palette.background.default, 0.8)};
          ${theme.shadows[10]};
        `}
      >
        <CardContent>
          <Typography variant="h5">Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (searchResults.count === 0) {
    return (
      <Card
        css={css`
          z-index: 9999999;
          min-width: 500px;
          backdrop-filter: blur(20px);
          background-color: ${rgba(theme.palette.background.default, 0.8)};
          ${theme.shadows[10]};
        `}
      >
        <CardContent>
          <Typography variant="h5">No results</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      css={css`
        z-index: 9999999;
        backdrop-filter: blur(15px);
        background-color: ${rgba(theme.palette.background.default, 0.8)};
        min-width: 500px;
        ${theme.shadows[10]};
      `}
    >
      <CardContent
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <AssetsSearchResults
          assets={searchResults.assets}
          onResultClick={onResultClick}
        />
        <ChainsSearchResults
          chains={searchResults.chains}
          onResultClick={onResultClick}
        />
      </CardContent>
    </Card>
  );
}

interface SearchResults {
  loading: boolean;
  count: number;
  chains?: Chain[];
  assets?: Asset[];
}

function useGlobalSearch() {
  const { assetService, chainStore } = useOneInchAnalyticsAPIContext();

  const [assets, setAssets] = useState<Asset[]>();
  const [chains, setChains] = useState<Chain[]>();
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    setAssets(assetService?.store.search(search));
    setChains(chainStore?.search(search));
  }, [search, assetService, chainStore]);

  const resultsCount = (assets?.length ?? 0) + (chains?.length ?? 0);

  const loading = !assetService || !chainStore;

  const results: SearchResults = {
    loading,
    count: resultsCount,
    chains,
    assets,
  };

  return {
    results,
    search,
    setSearch,
  };
}

export function GlobalSearchInternal(props: GlobalSearchProps) {
  const { results, search, setSearch } = useGlobalSearch();
  const [open, setOpen] = useState<boolean>(false);
  const [panelAnchorEl, setPanelAnchorEl] = useState<null | HTMLElement>(null);

  const closePopper = () => {
    setOpen(false);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSearch(e.target.value);
    setOpen(true);
  };

  return (
    <div
      tabIndex={0}
      onMouseUp={(e) => {
        setPanelAnchorEl(e.currentTarget);
        setOpen(true);
        e.stopPropagation();
      }}
      onBlur={closePopper}
    >
      <SearchInput
        placeholder="Search wallet, token, protocol..."
        onChange={handleSearchChange}
        value={search}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            // ESC
            setOpen(false);
          }
        }}
        {...props}
      />
      <div>
        <Popper
          open={open}
          id="global-search"
          anchorEl={panelAnchorEl}
          placement="bottom-start"
          css={css`
            z-index: 9889888;
          `}
          transition
        >
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={closePopper} mouseEvent="onMouseUp">
              <Fade {...TransitionProps} timeout={350}>
                <div>
                  <SearchResultsCard
                    searchResults={results}
                    onResultClick={(e) => {
                      closePopper();
                      setSearch(undefined);
                      e.stopPropagation();
                    }}
                  />
                </div>
              </Fade>
            </ClickAwayListener>
          )}
        </Popper>
      </div>
    </div>
  );
}

export interface GlobalSearchProps extends SearchInputProps {}

export function GlobalSearch(props: GlobalSearchProps) {
  return <GlobalSearchInternal {...props} />;
}
