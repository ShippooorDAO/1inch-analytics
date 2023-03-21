import { Container } from '@mui/material';

import Dashboard from '@/layouts/DashboardLayout';

export default function Home() {
  return <Container></Container>;
}

Home.getLayout = function getLayout(page: any) {
  return <Dashboard>{page}</Dashboard>;
};
