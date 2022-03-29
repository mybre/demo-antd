import { Suspense, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import PageLoading from './components/PageLoading';
import Performance from './components/Performance';
import { query } from '@/services/ant-design-pro/stock';

const Analysis = () => {
  console.log(2);

  const { data, loading, error } = useRequest(query, {
    defaultParams: {
      input: '123',
      type: '14',
      token: 'D43BF722C8E33BDC906FB84D85E326E8',
      securitytype: '1,2,3,4,25,27',
      count: 5,
    },
  });
  console.log(data, 'data');
  console.log(loading, 'loading');
  console.log(error, 'error');
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
          <Performance options={options} />
        </Suspense>
      </>
    </GridContent>
  );
};

export default Analysis;
