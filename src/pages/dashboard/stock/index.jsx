import { useRequest } from 'ahooks';
import React from 'react';
import PageLoading from './components/PageLoading';
import Performance from './components/Performance';
import { getData } from '@/services/ant-design-pro/stock';
import { Suspense, useState, useEffect } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import StockSelect from '@/pages/dashboard/stock/components/StockSelect';
function numberFormat(value) {
  const param = {};
  const k = 1000;
  const sizes = ['千', '万', '亿', '万亿'];
  let i;
  if (value < k) {
    param.value = value;
    param.unit = '';
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));

    param.value = (value / Math.pow(k, i)).toFixed(2);
    param.unit = sizes[i];
  }
  return param;
}
const formatData = (res) => {
  const BASIC_EPS = {
    name: '每股收益',
    type: 'line',
    yAxisIndex: '0',
    data: res.result.data.map((v) => v.BASIC_EPS),
  };
  const TOTAL_OPERATE_INCOME = {
    name: '营业收入',
    type: 'line',
    yAxisIndex: '1',
    data: res.result.data.map((v) => v.TOTAL_OPERATE_INCOME),
  };
  const color = ['#5470C6', '#91CC75', '#EE6666'];

  const PARENT_NETPROFIT = {
    name: '归属净利润',
    type: 'line',
    yAxisIndex: '2',
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
          return numberFormat(value);
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
          return numberFormat(value);
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
      let str = params[0].name + '<br/>';
      for (const item of params) {
        str = `${str}<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
          item.color
        }"></span>${item.seriesName}:${numberFormat(item.value)}<br/>`;
      }
      return str;
    },
  };
  const toolbox = {
    feature: {
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  };
  const grid = { top: 8, right: 8, bottom: 24, left: 36 };

  return { color, toolbox, tooltip, legend, series, xAxis, yAxis, grid };
};

export default () => {
  const [stock, setStock] = useState({ value: '600519' });
  const [options, setOptions] = useState({
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
        setOptions(formatData(res));
      });
    }
  }, [stock]);

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
