import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
    brainContainer: {
        width: '50%',
        height: 'max-content',
    },
    gif: {
        width: '100%',
        height: 'auto',
        // borderRadius: '100%',
        objectFit: 'cover',
    },
}));

export default useStyles;