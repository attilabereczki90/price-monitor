import React from 'react';
import { MetaData } from '../../types/GlobalTypes.d';
import './MonitorHeader.css';

const buildMetaData = (metaSource: MetaData) => {
  const information = metaSource['1. Information'];
  const symbol = metaSource['2. Symbol'];
  const lastRefreshed = metaSource['3. Last Refreshed'];
  return [information, symbol, lastRefreshed];
};

const MonitorHeader = (props: any): JSX.Element => {
  const { data } = props;

  return (
   <div className="monitor-header">
    <p>
      <b>Symbol:</b> {buildMetaData(data['Meta Data'])[1]}
    </p>
    <p>
      <b>Last Refreshed:</b> {new Date(buildMetaData(data['Meta Data'])[2]).toLocaleDateString('en-US')}
    </p>
    <p>
      <b>Time Zone:</b> {new Date(buildMetaData(data['Meta Data'])[2]).toLocaleDateString('en-US')}
    </p>
    <p>
      <b>Information:</b> {buildMetaData(data['Meta Data'])[0]}, Last Refreshed: {new Date(buildMetaData(data['Meta Data'])[2]).toLocaleDateString('en-US')}
    </p>
   </div>
  );
}

export default MonitorHeader;