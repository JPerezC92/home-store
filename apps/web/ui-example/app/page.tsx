'use client';

import { Layout } from '@/components/layout';
import { Transactions } from '@/components/transactions';

export default function Home() {
  return (
    <Layout>
      <Transactions />
    </Layout>
  );
}
