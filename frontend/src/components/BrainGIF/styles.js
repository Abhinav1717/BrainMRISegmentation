import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
    brainContainer: {
        width: '62%',
        height: 'max-content',
    },
    gif: {
        width: '750px',
        height: '700px',
        borderRadius: '100%',
        objectFit: 'cover',
    },
}));

export default useStyles;