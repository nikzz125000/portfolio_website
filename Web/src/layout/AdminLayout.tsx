import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useAuthActions } from "../hooks/useAuthActions";
import {
  Menu as MenuIcon,
  ExitToApp,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const adminMenuItems = [
    { label: "Home Page", path: "/admin/dashboard" },
    { label: "Projects", path: "/admin/projects" },
    { label: "My Resume", path: "/admin/resume" },
      { label: "Scroll Speed", path: "/admin/scroll_speed" },
      { label: "Background Color", path: "/admin/background_color" },
           { label: "Paddings", path: "/admin/padding" },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        {adminMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: {
              xs: "100%",
              md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            },
            ml: {
              md: drawerOpen ? `${drawerWidth}px` : 0,
            },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            {/* Desktop drawer toggle button - only visible on md+ screens */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDesktopDrawerToggle}
              sx={{
                mr: 2,
                display: { xs: "none", md: "block" },
              }}
            >
              {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>

            {/* Mobile drawer toggle button - only visible on mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>

            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user?.email}
            </Typography>

            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{
            width: { md: drawerOpen ? drawerWidth : 0 },
            flexShrink: { md: 0 },
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                transition: theme.transitions.create("transform", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                transform: drawerOpen
                  ? "translateX(0)"
                  : `translateX(-${drawerWidth}px)`,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: {
              xs: "100%",
              md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            },
            ml: {
              md: drawerOpen ? 0 : 0,
            },
            mt: "64px", // AppBar height
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default AdminLayout;
