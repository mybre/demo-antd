import { useRequest } from 'ahooks';
import React from 'react';
import PageLoading from './components/PageLoading';
import Performance from './components/Performance';
import { query, getData } from '@/services/ant-design-pro/stock';
import { Suspense, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import StockSelect from "@/pages/dashboard/stock/components/StockSelect";
export default () => {
  const { data: queryData, loading, error } = useRequest(query, {
    defaultParams: {
      input: '123',
      type: '14',
      token: 'D43BF722C8E33BDC906FB84D85E326E8',
      securitytype: '1,2,3,4,25,27',
      count: 5,
    },
  });
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
  console.log(queryData, 'data')
  if(error) {
    return <div>error</div>
  }
  if(loading) {
    return <PageLoading />
  }
  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <StockSelect response={queryData}/>
          <Performance options={options} />
        </Suspense>
      </>
    </GridContent>
  );
};
