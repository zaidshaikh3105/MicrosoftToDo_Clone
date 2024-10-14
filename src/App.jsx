import { createTheme, ThemeProvider } from "@mui/material/styles";
import Appbar from "./components/Appbar";

// Define the MSTodo theme colors and typography
const theme = createTheme({
  palette: {
    primary: {
      main: "#0078d4", // MSTodo blue
    },
    background: {
      default: "#f3f2f1", // MSTodo background gray
    },
    text: {
      primary: "#333333", // Heading text color
      secondary: "#605e5c", // Body text color
    },
  },
  typography: {
    fontFamily: "Segoe UI, sans-serif", // Microsoft font
    h6: {
      fontWeight: 600, // Bold for titles
    },
    body1: {
      fontSize: "1rem",
      color: "#605e5c", // Body text
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Appbar />
    </ThemeProvider>
  );
}

export default App;
