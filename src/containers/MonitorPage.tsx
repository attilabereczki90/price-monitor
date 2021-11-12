import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from '@mui/material';
import { connect, useDispatch } from 'react-redux';
import { DataDetails } from '../types/ActionTypes';
import { getHistory } from '../actions/monitor/MonitorActions';
import { AppReducerState, MonitorReducerState } from '../types/ReducerTypes';
import DataTable from '../components/datatable/DataTable';
import { useEffect } from 'react';
import CandlestickDataChart from '../components/datachart/CandlestickDataChart';
import './MonitorPage.css';

interface IStateToProps {
  monitor: MonitorReducerState[];
  app: AppReducerState;
}

const MonitorPage = (props: any): JSX.Element => {
  const { monitor, app } = props;
  const initialSearchDetails: DataDetails = {
    securityTicker: '',
    timeSeries: 'TIME_SERIES_MONTHLY',
  };

  const timeFrame = {
    TIME_SERIES_MONTHLY: 'Monthly Time Series',
    TIME_SERIES_WEEKLY: 'Weekly Time Series',
    TIME_SERIES_DAILY: 'Time Series (Daily)',
    TIME_SERIES_INTRADAY: 'Time Series (5min)',
  };

  const [searchDetails, setSearchDetails] = useState(initialSearchDetails);
  const [toggleView, setToggleView] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if(monitor.error) {
      setOpenModal(true);
    }
  }, [monitor]);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      const { value } = event.target;
      setSearchDetails({
        ...searchDetails,
        securityTicker: value.toUpperCase(),
      });
    }
  };

  const handleSeriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      const { name, value } = event.target;
      const newSearchDetails = {
        ...searchDetails,
        [name]: value,
      };
      setSearchDetails(newSearchDetails);
      if(searchDetails.securityTicker.length) {
        dispatch(getHistory(newSearchDetails));
      }
    }
  };

  const handleSearch = () => {
    dispatch(getHistory(searchDetails));
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleViewChange = () => {
    setToggleView(!toggleView);
  };

  return (
    <div className="container">
      <div className="search-container">
        <TextField
          className="ticker-search-input"
          name="security-ticker"
          sx={
            {
              "& .MuiFormLabel-root": {
                fontStyle: 'italic',
              },
            }
          }
          variant="outlined"
          label="Enter Symbol"
          helperText=""
          onChange={handleSearchTextChange}
        />
        <Button
          className="ticker-search-button"
          sx={{
            margin: '10px',
          }}
          variant="contained"
          disabled={!searchDetails.securityTicker}
          onClick={() => handleSearch()}
         >Search</Button>
         <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="time-series"
            name="timeSeries"
            value={searchDetails.timeSeries}
            defaultValue="TIME_SERIES_MONTHLY"
            onChange={handleSeriesChange}
          >
            <FormControlLabel
              value="TIME_SERIES_MONTHLY"
              control={<Radio color="primary" size="small" />}
              label="Monthly"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="TIME_SERIES_WEEKLY"
              control={<Radio color="primary" size="small" />}
              label="Weekly"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="TIME_SERIES_DAILY"
              control={<Radio color="primary" size="small" />}
              label="Daily"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="TIME_SERIES_INTRADAY"
              control={<Radio color="primary" size="small" />}
              label="Intraday"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
        <div className="toggle-input">
            Chart
            <Switch
              checked={toggleView}
              onChange={handleViewChange}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            Table
          </div>
      </div>
      {app.isLoading &&
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
            backgroundColor: 'white',
          }}>
          <CircularProgress sx={{
            animation: 'MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite, changeColor 2s linear infinite',
          }} />
          <p className="loading-label">Please wait</p>
        </Box>
      }
      {!app.isLoading && Object.keys(monitor.tickerData).length > 0 && toggleView && (
          <DataTable data={monitor.tickerData} timeSeries={timeFrame[searchDetails.timeSeries]} />
        )
      }
      {!app.isLoading && Object.keys(monitor.tickerData).length > 0 && !toggleView && (
          <CandlestickDataChart data={monitor.tickerData} timeSeries={timeFrame[searchDetails.timeSeries]} />
        )
      }
      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There is no match for this search term. Please try another symbol.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state: any): IStateToProps => ({
  monitor: state.monitor,
  app: state.app,
});

export default connect(mapStateToProps)(MonitorPage);
