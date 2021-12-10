import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import BrainGIF from './components/BrainGIF';
import ImageForm from './components/ImageForm';
import { lightTheme } from './utils/theme';
import './App.css';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
  root: {
    width: '100%',
    height: '100vh',
    background: "#00071b",
    boxSizing: 'border-box',
    padding: '50px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divCenter: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    flexDirection: 'column',
  },
  imageList: {
    gap: '250px !important',
  },
  imgStyle: {
    borderRadius: '10px',
    boxShadow: '#0733a7  0px 0px 70px -10px, #0733a7 0px 0px 60px -20px, #0733a7 0px 0px 3px 0px !important',
  },
  flexContainer: {
    width: "100%",
    position: 'relative',
    height: '100px',
  },
  org: {
    position: 'absolute',
    left: '21%',
  },
  infer: {
    position: 'absolute',
    right: '20%',
  },
  square: {
    width: '400px',
    height: '400px',
    marginBottom: '100px',
  },
  img: {
    width: '100%',
    height: 'auto',
  },
  marginB: {
    marginBottom: '60px !important',
  },
}));

const App = () => {
  const classes = useStyles();
  const [ images, setImages ] = useState([]);
  const [ orgImages, setOrgImages ] = useState([]);
  const [ ind, setInd ] = useState(null);
  let loadImages = [];

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
        const dataURL = canvas.toDataURL('image/jpeg', 1);
        resolve(dataURL);
      };

      img.src = src;
      if (img.complete || img.complete === undefined) {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        img.src = src;
      }
    });
 };

  const imageChangeHandler = (setUploadClicked, allFiles) => {
    setUploadClicked(true);
    setImages([]);
    setOrgImages([]);
    loadImages = [];
    let allPromises = [];
    let names = [];
    let nameString = new Map();
    for(let i = 0; i < allFiles.length; i++) {
        allPromises.push(convertToBase64(allFiles[i]).then((b64) => {
          let x = allFiles[i].name.split('_');
          let y = x[x.length - 1].split('.')[0];
           nameString.set(y, b64);
           names.push(parseInt(y));
        }))
    }

    let sendArray = [];
    Promise.all(allPromises).then((res) => {          
        names.sort(function( a , b){
          if(a > b) return 1;
          if(a < b) return -1;
          return 0;
      });

        console.log(names);
        // console.log(nameString);

        let arr = [];
        
        names.forEach((str) => {

          arr.push(nameString.get(`${str}`));
          sendArray.push(nameString.get(`${str}`).split(',')[1]);
        })
        
        setOrgImages(arr);

        // console.log(sendArray);
        axios.post(process.env.REACT_APP_BACKEND, {
            images: sendArray
        })
        .then((res) => {
          setImages(res.data.encoded_list_of_images);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setUploadClicked(false);
        });
    });
  }

  for(let i = 0; i < 2 * images.length; i++) {
    loadImages.push(<ImageListItem key={i}>
        <img
        className={classes.imgStyle}
        src={(i & 1) ? images[parseInt(i/2)] : orgImages[i/2]}
        alt="inference"
      />
  </ImageListItem>)
  }

  useEffect(() => {
    setTimeout(() => {
      if(images.length > 0) {
        if(ind === null) setInd(0);
        else setInd((ind+1) % images.length)
      } else if(images.length === 0) {
        setInd(null);
      }
    }, 200);
  });

  return <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <div className={classes.root}>
      <BrainGIF />
      <ImageForm imageChangeHandler={imageChangeHandler} />
    </div>
    <div className={classes.divCenter}>
    {images.length > 0 && orgImages.length > 0 && <Typography variant="h2" className={classes.marginB + ' common'}><strong>Inference Video</strong></Typography>}
    {images.length > 0 && ind !== null && <div className={classes.square}>
        <img alt="video" src={images[ind]} className={classes.img} />
    </div>}
    {images.length > 0 && orgImages.length > 0 && <div className={classes.flexContainer}>
      <Typography variant="h2" className={classes.org + ' common'}><strong>Original Image</strong></Typography>
      <Typography variant="h2" className={classes.infer + ' common'}><strong>Inference Image</strong></Typography>
    </div>}
    {images.length > 0 &&  orgImages.length > 0 && <ImageList className={classes.imageList + ' container'} sx={{ width: '60%', height: 500 }} cols={2} rowHeight={300}>
        {loadImages}
    </ImageList>}
    </div>
  </ThemeProvider> 
}

export default App;
