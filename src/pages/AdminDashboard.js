import { useDispatch, useSelector } from "react-redux";
import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import { NavLink, Switch, Route, Redirect, useHistory } from "react-router-dom";

import Report from "./Report";
import Users from "./Users";
import Logs from "./Logs";

const drawerWidth = 230;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function DashBoard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const { name } = useSelector((state) => state.user);

  const handleDrawer = () => {
    setOpen((value) => !value);
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "reset" });
    history.push("/");
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawer}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            { name: "Home", link: "/", icon: <HomeIcon /> },
            { name: "Users", link: "/admin/users", icon: <GroupIcon /> },
            { name: "Logs", link: "/admin/logs", icon: <DeviceHubIcon /> },
            { name: "Reports", link: "/admin/report", icon: <BarChartIcon /> },
          ].map((text, index) => (
            <NavLink
              to={text.link}
              key={index}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key={text}>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItem>
            </NavLink>
          ))}
          {["Logout"].map((text, index) => (
            <ListItem button key={index} onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/admin/report">
            <Report />
          </Route>
          <Route exact path="/admin/users">
            <Users />
          </Route>
          <Route exact path="/admin/logs">
            <Logs />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  );
}
