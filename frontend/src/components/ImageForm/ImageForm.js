import React, { useState, useEffect } from 'react';
import { Button, Input, Typography } from '@mui/material';
import useStyles from './styles'; 

const ImageForm = () => {
    const classes = useStyles();
    const [uploadClicked, setUploadClicked] = useState(false); 

    const convertToBase64 = (file) => {
        const src = URL.createObjectURL(file);
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const ratio = img.naturalWidth / img.naturalHeight;
            canvas.height = 350;
            canvas.width = ratio * 350;
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/jpeg', 0.70);
            resolve(dataURL);
          };
    
          img.src = src;
          if (img.complete || img.complete === undefined) {
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            img.src = src;
          }
        });
    };

    const imageChangeHandler = (event) => {
        setUploadClicked(true);
        // console.log(event.target.files);
        let allPromises = [];
        let allStrings = [];
        let allNames = [];
        for(let i = 0; i < event.target.files.length; i++) {
            allPromises.push(convertToBase64(event.target.files[i]).then((b64) => {
                console.log(b64);
               allStrings.push(b64);
               allNames.push(event.target.files[i].name);
            }))
        }

        Promise.all(allPromises).then((res) => {
            console.log('Completed', allStrings, allNames);
        })
    }

    return <div className={classes.fromContainer}>
    <label htmlFor="contained-button-file" className={classes.label}>
        <Input accept="image/*" id="contained-button-file" inputProps={{multiple : true}} type="file" onChange={imageChangeHandler} />
            <Button variant="contained" component="span" disabled={uploadClicked} className={classes.Button}>
                <Typography variant="h6" component="p">
                    Upload
                </Typography>
            </Button>
        </label>
    </div>
}

export default ImageForm;