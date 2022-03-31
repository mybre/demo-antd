import React from 'react';
import PageLoading from './components/PageLoading';
import { getData } from '@/services/ant-design-pro/stock';
import { Suspense, useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import StockSelect from '@/pages/dashboard/stock/components/StockSelect';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import { configResponsive, useResponsive } from 'ahooks';

function convertUint(t) {
  let e = Number(t);
  let n = 1;
  // eslint-disable-next-line no-sequences,no-return-assign
  return (
    e < 0 && (n = -1),
    (e = Math.abs(e)),
    // eslint-disable-next-line no-void
    isNaN(e)
      ? '--'
      : e < 1e4
      ? e.toFixed(2) * n
      : e >= 1e4 && e < 1e8
      ? (e / 1e4).toFixed(2) * n + '万'
      : e >= 1e8
      ? (e / 1e8).toFixed(2) * n + '亿'
      : void 0
  );
}

const formatData = (res) => {
  const BASIC_EPS = {
    name: '每股收益',
    type: 'line',
    yAxisIndex: '0',
    smooth: true,
    data: res.result.data.map((v) => v.BASIC_EPS),
  };
  const TOTAL_OPERATE_INCOME = {
    name: '营业收入',
    type: 'line',
    yAxisIndex: '1',
    smooth: true,
    data: res.result.data.map((v) => v.TOTAL_OPERATE_INCOME),
  };
  const color = ['#5470C6', '#91CC75', '#EE6666'];

  const PARENT_NETPROFIT = {
    name: '归属净利润',
    type: 'line',
    yAxisIndex: '2',
    smooth: true,
    data: res.result.data.map((v) => v.PARENT_NETPROFIT),
  };

  const yAxis = [
    {
      type: 'value',
      name: '每股收益',
      position: 'left',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: color[0],
        },
      },
      axisLabel: {
        formatter: '{value} 元',
      },
    },
    {
      type: 'value',
      name: '营业收入',
      position: 'right',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: color[1],
        },
      },
      axisLabel: {
        formatter: (value) => {
          return convertUint(value);
        },
      },
    },
    {
      type: 'value',
      name: '归属净利润',
      position: 'right',
      alignTicks: true,
      offset: 80,
      axisLine: {
        show: true,
        lineStyle: {
          color: color[2],
        },
      },
      axisLabel: {
        formatter: (value) => {
          return convertUint(value);
        },
      },
    },
  ];
  const series = [BASIC_EPS, TOTAL_OPERATE_INCOME, PARENT_NETPROFIT];
  const legend = series.map((v) => v.name);
  const xAxisData = res.result.data.map((v) => v.REPORTDATEWZ);
  const xAxis = {
    type: 'category',
    axisTick: {
      alignWithLabel: true,
    },
    // prettier-ignore
    data: xAxisData,
    axisLabel: {
      show: true,
      interval: 0,
      rotate: 40,
      textStyle: {
        color: '#333',
      },
    },
  };
  const tooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
    },
    formatter: (params) => {
      const title = `<div>${params[0].name}</div>`;
      let line = '';
      for (const item of params) {
        // eslint-disable-next-line no-unused-expressions
        line += `<div style="display:flex;justify-content: space-between;align-items: center;width: 200px">
                <div>
                  <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
                    item.color
                  }"></span>
                  <span>${item.seriesName}<span>
                </div>
                <div>${convertUint(item.value)} 元</div>
              </div>
              `;
      }
      return title + line;
    },
  };
  const toolbox = {
    feature: {
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  };
  const grid = { containLabel: true };
  console.log(legend, 'eeeeellll');
  // return { color, toolbox, tooltip, legend, series, xAxis, yAxis, grid };
  return { xAxis, series, yAxis, color, grid, tooltip };
  // return {
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon1', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   },
  // };
};

export default () => {
  const [stock, setStock] = useState({ value: '600519' });
  const [options, setOptions] = useState({
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
  });
  useEffect(() => {
    console.log(stock);
    if (stock) {
      getData({
        sortColumns: 'REPORTDATE',
        sortTypes: -1,
        pageSize: 20,
        pageNumber: 1,
        columns: 'ALL',
        filter: `(SECURITY_CODE="${stock.value}")`,
        reportName: 'RPT_LICO_FN_CPD_BB',
      }).then((res) => {
        res?.result?.data?.reverse();
        setOptions({ ...options, ...formatData(res) });
      });
    }
  }, [stock]);

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <StockSelect onChange={(value) => setStock(value)} />

          <Card
            bordered={false}
            style={{
              marginTop: 32,
            }}
          >
            <ReactECharts option={options} style={{ height: '50vh' }} />
          </Card>
        </Suspense>
      </>
    </GridContent>
  );
};
