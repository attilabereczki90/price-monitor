import React, { useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { connect, useDispatch } from 'react-redux';
import { SearchDetails } from '../types/ActionTypes';
import { getHistory } from '../actions/monitor/MonitorActions';
import { AppReducerState, MonitorReducerState } from '../types/ReducerTypes';
import DataTable from '../components/DataTable';
import { useEffect } from 'react';

interface IStateToProps {
  monitor: MonitorReducerState[];
  app: AppReducerState;
}

const MonitorPage = (props: any): JSX.Element => {
  const { monitor, app } = props;
  const initialSearchDetails: SearchDetails = {
    securityTicker: '',
    timeSeries: 'TIME_SERIES_MONTHLY',
  };

  const timeFrame = {
    TIME_SERIES_MONTHLY: "Monthly Time Series",
    TIME_SERIES_WEEKLY: "Weekly Time Series",
    TIME_SERIES_DAILY: "Time Series (Daily)",
    TIME_SERIES_INTRADAY: "Time Series (5min)",
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
      const { value } = event.target;
      setSearchDetails({
        ...searchDetails,
        securityTicker: value.toUpperCase(),
      });
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
          onClick={() => handleSearch()}
         >Search</Button>
         {app.isLoading &&
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
         }
      </div>
      {Object.keys(monitor.tickerData).length > 0 && (
        <DataTable data={monitor.tickerData} />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Warning"}
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