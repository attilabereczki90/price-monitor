import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  HoverTooltip,
} from 'react-financial-charts';
import { MetaData, TimeSeriesData } from '../datatable/DataTable.d';
import { CandlestickData } from './DataChart.d';
import './DataChart.css';

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
    ? 'rgba(38, 166, 154, 0.3)'
    : 'rgba(239, 83, 80, 0.3)';
};

const volumeSeries = (data: CandlestickData) => {
  return data.volume;
};

const openCloseColor = (data: CandlestickData) => {
  return data.close > data.open ? '#26a69a' : '#ef5350';
};

const CandlestickDataChart = (props: any): JSX.Element => {
  const { data, timeSeries } = props;
  const height = 800;
  const width = 1200;
  const margin = { left: 48, right: 48, top: 40, bottom: 24 };
  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d: CandlestickData) => new Date(d.date)
  );

  const ema8 = ema()
    .id(1)
    .options({ windowSize: 8 })
    .merge((d: any, c: any) => {
        d.ema8 = c;
    })
    .accessor((d: any) => d.ema8);

  const ema15 = ema()
    .id(2)
    .options({ windowSize: 15 })
    .merge((d: any, c: any) => {
        d.ema15 = c;
    })
    .accessor((d: any) => d.ema15);

  const elder = elderRay();
  const calculatedData = elder(ema15(ema8(generateData(data[timeSeries]))));
  const { data: chartData, xScale, xAccessor, displayXAccessor } = ScaleProvider(calculatedData);

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
  const dateTimeFormat = '%d %b';
  const timeDisplayFormat = timeFormat(dateTimeFormat);
  const max = xAccessor(chartData[chartData.length - 1]);
  const min = xAccessor(chartData[Math.max(0, chartData.length - 100)]);
  const xExtents = [min - 1, max + 1];
  const gridHeight = height - margin.top - margin.bottom;
  const elderRayHeight = 100;
  const elderRayOrigin = (_: number, h: number) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const chartHeight = gridHeight - elderRayHeight;
  const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - elderRayHeight];

  return (
    <>
      <p>
        Symbol: {buildMetaData(data['Meta Data'])[1]}, Last Refreshed: {buildMetaData(data['Meta Data'])[2]}
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
            <XAxis showGridLines showTicks={false} showTickLabel={false}  />
            <YAxis showGridLines tickFormat={pricesDisplayFormat} axisAt={'left'} orient={'left'} />
            <CandlestickSeries />
            <LineSeries yAccessor={ema15.accessor()} strokeStyle={ema15.stroke()} />
            <CurrentCoordinate yAccessor={ema15.accessor()} fillStyle={ema15.stroke()} />
            <LineSeries yAccessor={ema8.accessor()} strokeStyle={ema8.stroke()} />
            <CurrentCoordinate yAccessor={ema8.accessor()} fillStyle={ema8.stroke()} />
            <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
            <EdgeIndicator
                itemType="last"
                rectWidth={margin.right}
                fill={openCloseColor}
                lineStroke={openCloseColor}
                displayFormat={pricesDisplayFormat}
                yAccessor={yEdgeIndicator}
            />
            <MovingAverageTooltip
                origin={[8, -28]}
                options={[
                  {
                    yAccessor: ema15.accessor(),
                    type: 'EMA',
                    stroke: ema15.stroke(),
                    windowSize: ema15.options().windowSize,
                  },
                  {
                    yAccessor: ema8.accessor(),
                    type: 'EMA',
                    stroke: ema8.stroke(),
                    windowSize: ema8.options().windowSize,
                  },
                ]}
            />

            <OHLCTooltip origin={[8, -32]} />
            <HoverTooltip
              yAccessor={ema8.accessor()}
              tooltip={{
                content: ({ currentItem }) => ({
                  x: currentItem.date,
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
        <Chart
            id={4}
            height={elderRayHeight}
            yExtents={[0, elder.accessor()]}
            origin={elderRayOrigin}
            padding={{ top: 8, bottom: 8 }}
        >
            <XAxis gridLinesStrokeStyle="#e0e3eb" ticks={25} showTicks={false} fontSize={12} />
            <YAxis ticks={4} tickFormat={pricesDisplayFormat} axisAt={'left'} orient={'left'} fontSize={14} />

            <MouseCoordinateX displayFormat={timeDisplayFormat} />
            <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />

            <ElderRaySeries yAccessor={elder.accessor()} />

            <SingleValueTooltip
                yAccessor={elder.accessor()}
                yLabel="Elder Ray"
                yDisplayFormat={(d: any) =>
                    `${pricesDisplayFormat(d.bullPower)}, ${pricesDisplayFormat(d.bearPower)}`
                }
                origin={[8, 16]}
            />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    </>
  );
}

export default CandlestickDataChart;
