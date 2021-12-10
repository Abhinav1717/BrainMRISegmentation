import React, { useState, useEffect } from 'react';
import useStyles from './styles';

const BrainGIF = () => {
    const classes = useStyles();

    return <div className={classes.brainContainer}>
        <img src="/brain.gif" alt="brain-gif" className={classes.gif} />
    </div>
};

export default BrainGIF;