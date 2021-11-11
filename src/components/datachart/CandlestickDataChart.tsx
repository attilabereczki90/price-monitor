import React from 'react';
import { format } from 'd3-format';
import {
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  BarSeries,
  CandlestickSeries,
  OHLCTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateY,
  HoverTooltip,
} from 'react-financial-charts';
import { MetaData, TimeSeriesData } from '../datatable/DataTable.d';
import { CandlestickData } from './DataChart.d';
import './DataChart.css';
import { colors } from '../../utils';

const createData = (date: string, seriesData: TimeSeriesData) => {
  return { date, open: +seriesData['1. open'], high: +seriesData['2. high'], low: +seriesData['3. low'], close: +seriesData['4. close'], volume: +seriesData['5. volume'] }
}

const generateData = (object: { [index: string]: TimeSeriesData }[]) => {
  let rows = [];

  for (const property in object) {
    const date = property;
    const seriesData: any = object[property];
    rows.push(createData(date, seriesData));
  }

  return rows.slice(0, 30);
};

const buildMetaData = (metaSource: MetaData) => {
  const information = metaSource['1. Information'];
  const symbol = metaSource['2. Symbol'];
  const lastRefreshed = metaSource['3. Last Refreshed'];
  return [information, symbol, lastRefreshed];
};

const barChartExtents = (data: CandlestickData) => {
  return data.volume;
};

const candleChartExtents = (data: CandlestickData) => {
  return [data.high, data.low];
};

const yEdgeIndicator = (data: CandlestickData) => {
  return data.close;
};

const volumeColor = (data: CandlestickData) => {
  return data.close > data.open
    ? colors.cyan1
    : colors.red1;
};

const volumeSeries = (data: CandlestickData) => {
  return data.volume;
};

const openCloseColor = (data: CandlestickData) => {
  return data.close > data.open ? colors.cyan : colors.red;
};

const CandlestickDataChart = (props: any): JSX.Element => {
  const { data, timeSeries } = props;
  const height = 800;
  const width = 1200;
  const margin = { left: 48, right: 48, top: 40, bottom: 24 };
  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d: CandlestickData) => new Date(d.date)
  );

  const { data: chartData, xScale, xAccessor, displayXAccessor } = ScaleProvider(generateData(data[timeSeries]));

  const pricesDisplayFormat = format('.2f');
  const volumeDisplayFormat = (volume: number) => {
    if(Math.abs(volume) >= 1.0e+6) {
      return (Math.abs(volume) / 1.0e+6).toFixed(2) + 'M';
    } else if(Math.abs(volume) >= 1.0e+3) {
      return (Math.abs(volume) / 1.0e+3).toFixed(2) + 'k';
    } else {
      return Math.abs(volume);
    }
  };
  const max = xAccessor(chartData[chartData.length - 1]);
  const min = xAccessor(chartData[Math.max(0, chartData.length - 100)]);
  const xExtents = [min - 1, max + 1];
  const gridHeight = height - margin.top - margin.bottom;
  const elderRayHeight = 100;
  const barChartHeight = gridHeight / 4;
  const chartHeight = gridHeight - elderRayHeight;
  const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - elderRayHeight];

  return (
    <>
      <p>
        Symbol: {buildMetaData(data['Meta Data'])[1]}, Last Refreshed: {new Date(buildMetaData(data['Meta Data'])[2]).toLocaleDateString('en-US')}
      </p>
      <ChartCanvas
        className="monitor-chart"
        height={height}
        width={width}
        margin={margin}
        data={chartData}
        ratio={3}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xAccessor={xAccessor}
        xExtents={xExtents}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
        <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
            <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
        </Chart>
        <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
          <XAxis gridLinesStrokeStyle="#e0e3eb" ticks={25} showTicks={false} fontSize={12} />
          <YAxis showGridLines tickFormat={pricesDisplayFormat} axisAt={'left'} orient={'left'} />
          <CandlestickSeries />
          <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
          <EdgeIndicator
              itemType="last"
              rectWidth={margin.right}
              fill={openCloseColor}
              lineStroke={openCloseColor}
              displayFormat={pricesDisplayFormat}
              yAccessor={yEdgeIndicator}
          />

          <OHLCTooltip origin={[8, -12]} fontSize={12} />
          <HoverTooltip
            yAccessor={(d) => d.open}
            tooltip={{
              content: ({ currentItem }) => ({
                x: new Date(currentItem.date).toLocaleDateString('en-US'),
                y: [
                  {
                    label: 'open',
                    value: currentItem.open && pricesDisplayFormat(currentItem.open),
                  },
                  {
                    label: 'high',
                    value: currentItem.high && pricesDisplayFormat(currentItem.high),
                  },
                  {
                    label: 'low',
                    value: currentItem.low && pricesDisplayFormat(currentItem.low),
                  },
                  {
                    label: 'close',
                    value: currentItem.close && pricesDisplayFormat(currentItem.close),
                  },
                  {
                    label: 'volume',
                    value: currentItem.volume && volumeDisplayFormat(currentItem.volume),
                  },
                ],
              }),
            }}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </>
  );
}

export default CandlestickDataChart;
