import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import jsonp from 'fetch-jsonp';
import qs from 'qs';
import React, { useState } from 'react';
import { query } from '@/services/ant-design-pro/stock';
import { useRequest } from 'ahooks';
import PageLoading from '@/pages/dashboard/stock/components/PageLoading';

const { Option } = Select;

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      showSearch
      allowClear
      filterOption={false}
      optionLabelProp={'label'}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options &&
        options?.QuotationCodeTable?.Data?.map((item) => {
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
} // Usage of DebounceSelect

async function fetchOptions(queryText) {
  return new Promise((resolve) => {
    query({
      input: queryText,
      type: '14',
      token: 'D43BF722C8E33BDC906FB84D85E326E8',
      securitytype: '1,2,3,4,25,27',
      count: 5,
    }).then((data) => {
      resolve(data);
    });
  });
}

export default function StockSelect({ onChange }) {
  const [value, setValue] = React.useState(null);
  return (
    <DebounceSelect
      value={value}
      placeholder="Select stock"
      fetchOptions={fetchOptions}
      onChange={(newValue) => {
        setValue(newValue);
        onChange(newValue)
      }}
      style={{
        width: '100%',
      }}
    />
  );
}
