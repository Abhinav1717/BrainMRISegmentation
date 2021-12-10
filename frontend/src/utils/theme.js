import {
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { ZINDEX } from "../zIndex";

let theme = createTheme({
  zIndex: {
    drawer: ZINDEX.drawer,
  },
  typography: {
    fontFamily:
      "'Poppins', 'Roboto', 'HelveticaNeue', 'Helvetica', 'Verdana', 'Arial', sans-serif",
    button: {
      textTransform: "none",
    },
  },
  palette: {
    type: "light",
    background: {
      default: "#fff",
      paper: "#fff",
    },
    primary: {
      main: "#3232bd",
      light: "#DAFAEB",
      contrastText: "#fff",
    },
    secondary: {
      main: "#DA205D",
    },
    text: {
      primary: "#202938",
      secondary: "#202938cc",
    },
    divider: "#cdd3d8",
    footerText: "#d9dbe1",
    forBgDarkText: "#ebf4f6",
    forGreyText: "#20293899",
    success: {
      main: "#5E40A4",
    },
    warning: {
      main: "#FF9E00",
    },
    error: {
      main: "#FF585D",
    },
    scanning: {
      background: {
        main: "#202938",
        // dark: "#233e56",
      },
      text: {
        contrastDark: "#fff",
      },
    },
    gradients: {
      green:
        "linear-gradient(180deg, rgba(74, 194, 154, 0.2) 24.71%, rgba(167, 198, 240, 0.2) 107.89%)",
      blue: "linear-gradient(180deg, rgba(167, 198, 240, 0.2) -10%, rgba(235, 244, 246, 0.2) 100%)",
      darkerBlue: `linear-gradient(135.28deg, rgba(167, 198, 240, 0.5) 2.82%, rgba(235, 244, 246, 0.5) 95.45%), linear-gradient(0deg, rgba(242, 242, 242, 0.7), rgba(242, 242, 242, 0.7)), #fff`,
    },
    header: {
      main: "#0f2033",
      light: "#f5f9fe",
      contrastText: "#fff",
    },
    cloud: {
      background: "#EBF4F6",
      search: "#f2f2f2",
    },
  },
  filter: {
    primary:
      "brightness(0) saturate(100%) invert(52%) sepia(97%) saturate(5061%) hue-rotate(194deg) brightness(100%) contrast(108%)",
    textPrimary:
      "brightness(0) saturate(100%) invert(8%) sepia(7%) saturate(839%) hue-rotate(295deg) brightness(99%) contrast(89%)",
  },
});

theme = createTheme(theme, {
  components: {
    MuiButton: {
      root: {
        padding: "8px 16px",
        // textTransform: 'capitalize',
        height: "40px",
        boxSizing: "border-box",
        outline: "0",
        border: "0",
      },
      outlined: {
        // textTransform: 'capitalize',
        boxSizing: "border-box",
        height: "44px",
        width: "190px",
        background: theme.palette.background.paper,
        borderWidth: "2px",
        borderRadius: "8px",
        padding: "7px 16px",
      },
      outlinedPrimary: {
        border: `2px solid ${theme.palette.primary.main}`,
      },
      contained: {
        // textTransform: 'capitalize',
        boxSizing: "border-box",
        color: theme.palette.background.paper,
        height: "44px",
        width: "190px",
        borderRadius: "8px",
        padding: "0px 12px",
      },
      containedPrimary: {
        backgroundColor: theme.palette.primary.main,
      },
      MuiChip: {
        label: {
          fontWeight: 500,
          fontSize: "0.75rem", // 12
          color: theme.palette.text.primary,
        },
      },
      MuiIconButton: {
        colorPrimary: {
          backgroundColor: theme.palette.primary.main,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        },
      },
      MuiDrawer: {
        paperAnchorBottom: {
          borderRadius: "25px 25px 0 0",
        },
        paperAnchorLeft: {
          borderRadius: "0 25px 25px 0",
          [theme.breakpoints.up("md")]: {
            borderRadius: "0 40px 40px 0",
          },
        },
        modal: {
          zIndex: `${ZINDEX.drawer} !important`,
        },
      },
      MuiDivider: {
        root: {
          width: "100%",
          margin: "12px 0",
        },
      },
    },
  },
});

const lightTheme = responsiveFontSizes(theme, {
  breakpoints: ["xs", "sm", "md", "lg"],
  // disableAlign
  factor: 2,
  // variants
});

export { lightTheme };
