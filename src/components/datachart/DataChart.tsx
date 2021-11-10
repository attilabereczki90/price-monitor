import React from 'react';
import Chart from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TimeSeriesData } from '../datatable/DataTable.d';

const DataChart = (props: any): JSX.Element => {
  const { data, timeSeries } = props;
  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    type: "bar",
  };

  const generateLabels = (object: { [index: string]: TimeSeriesData }[]) => {
    const labels = [];
    for (const property in object) {
      if(labels.length === 30) {
        break;
      }
      labels.push(property);
    }

    return labels;
  };

  const generateDatasets = (object: { [index: string]: TimeSeriesData }[]) => {
    const dataSets: Chart.ChartDataset<'bar'>[] = [
      {
        label: "Open",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [] as number[],
      },
      {
        label: "High",
        backgroundColor: "rgba(155,231,91,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [] as number[],
      },
      {
        label: "Low",
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [] as number[],
      },
      {
        label: "Close",
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [] as number[],
      },
    ];

    for (const property in object) {
      const seriesData: any = object[property];
      if(dataSets[0].data.length === 30) {
        break;
      }
      dataSets[0].data.push(+seriesData['1. open']);
      dataSets[1].data.push(+seriesData['2. high']);
      dataSets[2].data.push(+seriesData['3. low']);
      dataSets[3].data.push(+seriesData['4. close']);
    }

    return dataSets;
  };

  const chartData: Chart.ChartData<"bar", (number | Chart.ScatterDataPoint | Chart.BubbleDataPoint | null)[], unknown> = {
    labels: generateLabels(data[timeSeries]),
    datasets: generateDatasets(data[timeSeries]),
  };

  return (
    <Bar
      data={chartData}
      options={options}
    />
  );
}

export default DataChart;