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
  TextField,
} from '@mui/material';
import { connect, useDispatch } from 'react-redux';
import { DataDetails } from '../types/ActionTypes';
import { getHistory } from '../actions/monitor/MonitorActions';
import { AppReducerState, MonitorReducerState } from '../types/ReducerTypes';
import DataTable from '../components/datatable/DataTable';
import { useEffect } from 'react';
import CandlestickDataChart from '../components/datachart/CandlestickDataChart';

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
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if(monitor.error) {
      setOpen(true);
    }
  }, [monitor]);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      const { name, value } = event.target;
      if (name === 'security-ticker') {
        setSearchDetails({
          ...searchDetails,
          securityTicker: value.toUpperCase(),
        });
      } else {
        setSearchDetails({
          ...searchDetails,
          [name]: value,
        });
      }
    }
  };

  const handleSearch = () => {
    dispatch(getHistory(searchDetails));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <div className="search-container">
        <TextField
          id="tickerSearchInput"
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
          id="tickerSearchButton"
          variant="outlined"
          disabled={!searchDetails.securityTicker}
          onClick={() => handleSearch()}
         >Search</Button>
         {app.isLoading &&
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
         }
         <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="time-series"
            name="timeSeries"
            value={searchDetails.timeSeries}
            defaultValue="TIME_SERIES_MONTHLY"
            onChange={handleSearchTextChange}
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
      </div>
      {Object.keys(monitor.tickerData).length > 0 && (
        // <DataTable data={monitor.tickerData} timeSeries={timeFrame[searchDetails.timeSeries]} />
        <CandlestickDataChart data={monitor.tickerData} timeSeries={timeFrame[searchDetails.timeSeries]} />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Warning'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There is no match. Please try another symbol.
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
