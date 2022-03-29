import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
const Page = ({ options }) => {
  return (
    <Card
      bordered={false}
      style={{
        marginTop: 32,
      }}
    >
      <ReactECharts option={options} style={{ height: '50vh' }} />
    </Card>
  );
};

export default Page;
