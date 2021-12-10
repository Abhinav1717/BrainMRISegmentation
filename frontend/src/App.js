import React from 'react';
import { makeStyles } from '@mui/styles';
import BrainGIF from './components/BrainGIF';
import ImageForm from './components/ImageForm';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
  root: {
    width: '100%',
    height: '100vh',
    background: "#000000",
    boxSizing: 'border-box',
    padding: '50px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const App = () => {
  const classes = useStyles();

  return <div className={classes.root}>
    <BrainGIF />
    <ImageForm />
  </div>
}

export default App;
