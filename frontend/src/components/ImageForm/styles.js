import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
    fromContainer: {
        width: '30%',
        minWidth: '300px',
        height: '500px',
        padding: '25px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
    },
    Button: {
        width: '180px',
        height: '50px',
        borderRadius: '15px',
    },
}));

export default useStyles;