import { css } from '@emotion/react';
import { Container, Typography } from '@mui/material';

import { HistogramChart } from '@/components/chart/HistogramChart';
import {
  StatsContainer,
  StatsContainerLayout,
} from '@/components/StatsContainer';
import Dashboard from '@/layouts/DashboardLayout';
import {
  TimeInterval,
  Timeseries,
  TimeWindow,
} from '@/shared/Model/Timeseries';

const revenueTimeseries: Timeseries = {
  name: 'Revenue',
  // imageUrl: '/vendors/chains/ethereum.svg',
  color: '#95a0d7',
  data: [
    {
      x: 1668384000,
      y: 1779905120.4854121,
    },
    {
      x: 1668988800,
      y: 2538616358.6104307,
    },
    {
      x: 1669593600,
      y: 1251016170.7653334,
    },
    {
      x: 1670198400,
      y: 944675150.9925743,
    },
    {
      x: 1670803200,
      y: 1467258101.5049558,
    },
    {
      x: 1671408000,
      y: 1207323703.1668549,
    },
    {
      x: 1672012800,
      y: 1151943247.4993353,
    },
    {
      x: 1672617600,
      y: 1200165480.3003216,
    },
    {
      x: 1673222400,
      y: 2004621613.703743,
    },
    {
      x: 1673827200,
      y: 1929162858.4731865,
    },
    {
      x: 1674432000,
      y: 1896111341.283863,
    },
    {
      x: 1675036800,
      y: 1356890999.09945,
    },
    {
      x: 1675641600,
      y: 1746423433.0898223,
    },
    {
      x: 1676246400,
      y: 2418655517.61963,
    },
    {
      x: 1676851200,
      y: 1438801197.6991875,
    },
    {
      x: 1677456000,
      y: 1344155969.806383,
    },
    {
      x: 1678060800,
      y: 6701870451.608492,
    },
    {
      x: 1678665600,
      y: 3510227312.7254043,
    },
    {
      x: 1679270400,
      y: 1293773339.1616871,
    },
    {
      x: 1679875200,
      y: 1190909640.635086,
    },
    {
      x: 1680480000,
      y: 1169568707.5717394,
    },
    {
      x: 1681084800,
      y: 1521835881.062703,
    },
    {
      x: 1681689600,
      y: 1569298539.4100723,
    },
    {
      x: 1682294400,
      y: 1071226563.4653662,
    },
    {
      x: 1682899200,
      y: 1348666271.2676032,
    },
    {
      x: 1683504000,
      y: 1165937180.4346042,
    },
    {
      x: 1684108800,
      y: 1019636232.4214599,
    },
    {
      x: 1684713600,
      y: 1330287814.1581075,
    },
    {
      x: 1685318400,
      y: 940543317.148559,
    },
    {
      x: 1685923200,
      y: 1153225395.046328,
    },
    {
      x: 1686528000,
      y: 1689703950.1932364,
    },
    {
      x: 1687132800,
      y: 1189987923.2035542,
    },
  ],
};

export default function TreasuryPage() {
  return (
    <Container
      css={css`
        padding-top: 20px;
        padding-bottom: 20px;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-flow: column;
          gap: 20px;
        `}
      >
        <Typography variant="h3">Treasury</Typography>
        <StatsContainer
          layout={StatsContainerLayout.ONE_HALF_ONE_HALF}
          leftContainer={{
            title: 'Net Worth',
            content: (
              <HistogramChart
                timeseriesList={[revenueTimeseries]}
                timeWindow={TimeWindow.YEAR_TO_DATE}
                timeInterval={TimeInterval.WEEKLY}
              />
            ),
          }}
          rightContainer={{
            title: 'Total Revenue',
            content: (
              <HistogramChart
                timeseriesList={[revenueTimeseries]}
                timeWindow={TimeWindow.YEAR_TO_DATE}
                timeInterval={TimeInterval.WEEKLY}
              />
            ),
          }}
        />
      </div>
    </Container>
  );
}

TreasuryPage.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
