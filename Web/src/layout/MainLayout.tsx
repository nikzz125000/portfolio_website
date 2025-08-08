import { Box } from '@mui/material';
import Footer from './Footer';



interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;