import React, { useState, useEffect } from 'react';
import { Button, Input, Typography } from '@mui/material';
import useStyles from './styles'; 
import styles from './ImageForm.module.css';

const ImageForm = ({ imageChangeHandler }) => {
    const classes = useStyles();
    const [uploadClicked, setUploadClicked] = useState(false); 

    const triggerPropFUnction = (event) => {
        imageChangeHandler(setUploadClicked, event.target.files);
    }

    return <div className={classes.fromContainer}>
    <Typography variant="h3" component="div" className={styles.fontStyle}>
        Brain MRI Segmentation
    </Typography>
    <label htmlFor="contained-button-file" className={classes.label}>
        <Input accept="image/*" id="contained-button-file" inputProps={{multiple : true}} type="file" onChange={triggerPropFUnction} />
            <Button variant="contained" component="span" disabled={uploadClicked} className={classes.Button}>
                <Typography variant="h5" component="p">
                    <strong>Upload</strong>
                </Typography>
            </Button>
        </label>
    </div>
}

export default ImageForm;