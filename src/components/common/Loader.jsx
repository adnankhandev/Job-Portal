import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from "react";


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  
export  const LinearIndeterminate = () => {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    );
  };