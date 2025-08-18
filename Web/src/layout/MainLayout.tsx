import { Box } from "@mui/material";


interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default MainLayout;
