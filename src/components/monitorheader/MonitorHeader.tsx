import React from 'react';
import { MetaData } from '../../types/GlobalTypes.d';

const buildMetaData = (metaSource: MetaData) => {
  const information = metaSource['1. Information'];
  const symbol = metaSource['2. Symbol'];
  const lastRefreshed = metaSource['3. Last Refreshed'];
  return [information, symbol, lastRefreshed];
};

const MonitorHeader = (props: any): JSX.Element => {
  const { data } = props;

  return (
  <p>
    Symbol: {buildMetaData(data['Meta Data'])[1]}, Last Refreshed: {new Date(buildMetaData(data['Meta Data'])[2]).toLocaleDateString('en-US')}
  </p>
  );
}

export default MonitorHeader;