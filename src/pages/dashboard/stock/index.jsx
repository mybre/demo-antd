import { useRequest } from 'ahooks';
import React from 'react';
import PageLoading from './components/PageLoading';
import Performance from './components/Performance';
import { query, getData } from '@/services/ant-design-pro/stock';
import { Suspense, useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import StockSelect from '@/pages/dashboard/stock/components/StockSelect';

export default () => {
  const [stock, setStock] = useState(null);
  useEffect(() => {
    console.log('effect');
  }, [stock]);
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <StockSelect onChange={(value) => setStock(value)} />
          <Performance options={options} />
        </Suspense>
      </>
    </GridContent>
  );
};
