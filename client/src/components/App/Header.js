import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import roleNumberFromString from "../../utils/roleConstants";

const auth = [
  { title: "Login", path: "auth/login" },
  { title: "Signup", path: "auth/signup" },
];

const pages = [
  { title: "Home", path: "" },
  { title: "Add Products", path: "add" },
  { title: "Manage Products", path: "manage" },
  { title: "Ship Products", path: "ship" },
];

const settings = [{ title: "Logout", path: "logout" }];

function ManufacturerType() {
  return (
    <div id="type-manufacturer-dashboard" className="dashboard-type">
      Manufactuer Dashboard
    </div>
  );
}

function DistributorType() {
  return (
    <div id="type-distributor-dashboard" className="dashboard-type">
      Distributor Dashboard
    </div>
  );
}

function RetailerType() {
  return (
    <div id="type-retailer-dashboard" className="dashboard-type">
      Retailer Dashboard
    </div>
  );
}

function ConsumerType() {
  return (
    <div id="type-consumer-dashboard" className="dashboard-type">
      Consumer Dashboard
    </div>
  );
}

const Header = () => {
  const [user, setUser] = React.useContext(UserContext);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setUser(null);

    localStorage.clear("token");

    navigate("/auth/login");
  };

  return (
    <div>
      {user && user.role === "manufacturer" && <ManufacturerType />}
      {user && user.role === "distributor" && <DistributorType />}
      {user && user.role === "retailer" && <RetailerType />}
      {user && user.role === "consumer" && <ConsumerType />}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              Authentic Product Identifier
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {user && user.role !== "manufacturer" && (
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to={`/${roleNumberFromString(user.role)}/scan`}>
                      <Typography textAlign="center">Scan Product</Typography>
                    </Link>
                  </MenuItem>
                )}
                {user &&
                  user.role === "manufacturer" &&
                  pages.map((page) => (
                    <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                      <Link to={`/1/${page.path}`}>
                        <Typography textAlign="center">{page.title}</Typography>
                      </Link>
                    </MenuItem>
                  ))}

                {!user &&
                  auth.map((page) => (
                    <MenuItem key={page.path} onClick={handleCloseNavMenu}>
                      <Link to={`/${page.path}`}>
                        <Typography textAlign="center">{page.title}</Typography>
                      </Link>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              Authentic Product Identifier
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {user && user.role !== "manufacturer" && (
                <Link to={`/${roleNumberFromString(user.role)}/scan`}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Scan {user.role !== "consumer" ? "and Ship" : "and Verify"}{" "}
                    Product
                  </Button>
                </Link>
              )}
              {user &&
                user.role === "manufacturer" &&
                pages.map((page) => (
                  <Link to={`/1/${page.path}`} key={page.path}>
                    <Button
                      key={page.title}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.title}
                    </Button>
                  </Link>
                ))}
              {!user &&
                auth.map((page) => (
                  <Link to={`/${page.path}`} key={page.path}>
                    <Button
                      key={page.title}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page.title}
                    </Button>
                  </Link>
                ))}
            </Box>

            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user && user.name}
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => {
                    if (setting.path === "logout") {
                      return (
                        <MenuItem
                          key={setting.path}
                          onClick={(e) => {
                            handleCloseUserMenu();
                            handleLogout();
                          }}
                        >
                          <Typography textAlign="center">
                            {setting.title}
                          </Typography>
                        </MenuItem>
                      );
                    }

                    return (
                      <MenuItem
                        key={setting.path}
                        onClick={handleCloseUserMenu}
                      >
                        <Typography textAlign="center">
                          {setting.title}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Header;
