import { Select } from 'antd';
import jsonp from 'fetch-jsonp';
import qs from 'qs';
import React, { useState } from 'react';
import { query } from '@/services/ant-design-pro/stock';
import { useRequest } from 'ahooks';
import PageLoading from '@/pages/dashboard/stock/components/PageLoading';

const { Option } = Select;

export default function StockSelect({ onChange }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const onSearch = (queryText) => {
    setLoading(true);
    setData(null);
    query({
      input: queryText,
      type: '14',
      token: 'D43BF722C8E33BDC906FB84D85E326E8',
      securitytype: '1,2,3,4,25,27',
      count: 5,
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <Select
      loading={loading}
      allowClear
      showSearch
      onSearch={onSearch}
      labelInValue
      optionLabelProp={'label'}
      onChange={onChange}
      style={{ width: 200 }}
    >
      {data &&
        data?.QuotationCodeTable?.Data?.map((item) => {
          return (
            <Option label={item.Name} key={item.Code} value={item.Code}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span aria-label={item.Name}>{item.Name}</span>
                <span>{item.Code}</span>
              </div>
            </Option>
          );
        })}
    </Select>
  );
}
