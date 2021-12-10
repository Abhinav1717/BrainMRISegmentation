import React, { useState, useEffect } from 'react';
import { Button, Input, Typography } from '@mui/material';
import axios from 'axios';
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
        let allPromises = [];
        let nameString = new Map();
        for(let i = 0; i < event.target.files.length; i++) {
            allPromises.push(convertToBase64(event.target.files[i]).then((b64) => {
               nameString.set(event.target.files[i].name, b64);
            }))
        }

        let sendArray = [];
        Promise.all(allPromises).then((res) => {          
            nameString.forEach((a) => {
                sendArray.push("b'" + a.slice(23));
                // console.log(a);
            });

            console.log(sendArray);
            axios.post(process.env.REACT_APP_BACKEND, {
                images: sendArray
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
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