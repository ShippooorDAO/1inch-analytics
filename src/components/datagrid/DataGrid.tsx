import { css as emotionCss } from '@emotion/css';
import { useTheme } from '@emotion/react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridValidRowModel,
} from '@mui/x-data-grid-premium';

export type DataGridProps<R extends GridValidRowModel = any> =
  DataGridPremiumProps<R> & React.RefAttributes<HTMLDivElement>;

export function DataGrid<R extends GridValidRowModel = any>({
  rows,
  ...props
}: DataGridProps<R>) {
  const theme = useTheme();

  return (
    <DataGridPremium
      sx={{
        fontWeight: '700',
        borderWidth: 0,
        '& .MuiDataGrid-cell': {
          border: 'none',
          borderColor: 'rgba(255, 255, 255, 0)',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: theme.palette.wardenTeal[800],
        },
      }}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0
          ? emotionCss`background-color: ${theme.palette.wardenTeal[700]};`
          : emotionCss`background-color: ${theme.palette.wardenTeal[500]};`
      }
      rows={!props.loading ? rows : []}
      {...props}
    />
  );
}
