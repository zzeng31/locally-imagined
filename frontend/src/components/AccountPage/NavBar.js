import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../styles";
import states from "../../states";
import "./NavBar.css";

/**
 * NavBar
 *
 * @return {object} JSX
 */
const NavBar = (props) => {
  const classes = styles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAccountMenu = Boolean(anchorEl);
  const [login, setLogin] = useState(props.login);
  useEffect(() => {
    props.getAvatar(sessionStorage.getItem("myAvatar"), "myAvatar");
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };
  //handle user input field change
  const handleInputChange = (event) => {
    props.setUser({
      ...props.user,
      [event.target.name]: event.target.value,
    });
  };
  const accountHandler = () => {
    setAnchorEl(null);
    props.setSearch("");
    const userID = JSON.parse(sessionStorage.getItem("user")).token.userID;
    const username = JSON.parse(sessionStorage.getItem("user")).userName;
    console.log(username);
    props.setUserID(userID);
    sessionStorage.removeItem("currentUserID");
    sessionStorage.setItem("currentUserID", userID);
    props.getAvatar(sessionStorage.getItem("myAvatar"), "myAvatar");
    history.push(`/profile/${username}`, {
      userID: userID,
      username: username,
    });
  };
  const accountSettingHandler = () => {
    setAnchorEl(null);
    props.setSearch("");
    const userID = JSON.parse(sessionStorage.getItem("user")).token.userID;

    //console.log(username);
    props.setUserID(userID);
    sessionStorage.removeItem("currentUserID");
    sessionStorage.setItem("currentUserID", userID);
    history.push(`/settings`, {
      userID: userID,
    });
    window.location.reload(false);
  };
  const handleLogout = () => {
    sessionStorage.clear();
    setLogin(false);
    states.login = false;
    setAnchorEl(null);
    history.push("/");
    window.location.reload(false);
  };
  return (
    <header className="appbar" elevation={1}>
      <div className="logo">
        <img
          src="/logo.png"
          alt="Locally Imagine"
          data-testid="app-logo"
          onClick={() => {
            history.push(`/`);
            window.location.reload(false);
          }}
          className="logo-image"
        ></img>
      </div>

      {/*display avatar and username and log out button when login*/}
      {login && (
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar className={classes.avatar} src={props.myAvatar}>
              {props.user.userName[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
      )}

      <Menu
        anchorEl={anchorEl}
        className="account-menu"
        open={openAccountMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={accountHandler}
          data-testid="button-profile"
          className="account-menu-item"
        >
          Profile
        </MenuItem>

        <MenuItem
          onClick={accountSettingHandler}
          data-testid="button-setting"
          className="account-menu-item"
        >
          Account Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          className="account-menu-item"
          data-testid="button-logout"
        >
          Logout
        </MenuItem>
      </Menu>
    </header>
  );
};

export default NavBar;
