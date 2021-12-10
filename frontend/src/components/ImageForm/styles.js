import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  // Use customized Theme type
    fromContainer: {
        width: '35%',
        minWidth: '300px',
        height: '500px',
        padding: '25px',
        borderRadius: '20px',
        gap: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    Button: {
        width: '220px',
        height: '60px',
        borderRadius: '15px !important',
        // boxShadow: '#3ee1f8 0px 50px 100px -20px, #3ee1f8 0px 30px 60px -30px, #3ee1f8 0px 0px 8px 0px !important',
    boxShadow: '#0733a7  0px 0px 100px -10px, #0733a7 0px 0px 60px -20px, #0733a7 0px 0px 6px 0px !important',

    },
    color: {
        color: "white !important",
        marginBottom: "20px !important",
    },
}));

export default useStyles;