import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Avatar,
  Collapse,
  IconButton,
  Modal,
  Paper,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Alert } from "@mui/material/";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { useHistory } from "react-router-dom";
import { useState } from "react";
import styles from "../styles";
import states from "../states";

/**
 * AppBar
 *
 * @return {object} JSX
 */
const Appbar = () => {
  const classes = styles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAccountMenu = Boolean(anchorEl);
  const [login, setLogin] = useState(states.login);
  const [openSignup, setSignup] = useState(false);
  const [error, setError] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };
  //handle user input field change
  const handleInputChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  //user object
  const [user, setUser] = React.useState({
    username: "",
    password: "",
    email: "",
    telephone: "",
    firstname: "",
    lastname: "",
    avatar: "",
  });

  //send login request to database
  const submitLogin = (event) => {
    event.preventDefault();
    console.log(user);
    const userlogin = { username: user.username, password: user.password };
    console.log(JSON.stringify(userlogin));
    fetch("http://localhost:3010/v0/login", {
      method: "POST",
      body: JSON.stringify(userlogin),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        states.login = true;
        return res.json();
      })
      .then((json) => {
        localStorage.setItem("user", JSON.stringify(json));
        states.user = JSON.parse(localStorage.getItem("user"));
        states.login = true;
        setLogin(states.login);
        alert(states.user.firstname + " " + states.user.lastname);

        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        //fake login
        setLogin(true);
        states.login = true;
        setError(true);
      });
  };
  //send signup request to database
  const submitSignup = (event) => {
    event.preventDefault();
    setSignup(false);
    //for testing
    alert(`firstname:${user.firstname}
    lastname:${user.lastname}
    email:${user.email}
    phone:${user.telephone}
    password:${user.password}`);
    fetch("http://localhost:3010/v0/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        localStorage.setItem("user", JSON.stringify(json));
        states.user = json;
        states.login = true;
        history.push("/");
      })
      .catch(() => {
        // do nothing.
      });
  };

  return (
    <AppBar className={classes.appBar} elevation={1}>
      <Toolbar className={classes.toolbar}>
        {/*title*/}
        <Typography className={classes.title} style={{ flex: 1 }}>
          Locally Imagined
        </Typography>
        {/*display fast login input fields while not login*/}
        {!login && (
          <form onSubmit={submitLogin}>
            {/*username input*/}
            <InputBase
              raised
              className={classes.fastlogin}
              placeholder="Username"
              inputProps={{ onChange: handleInputChange, required: true }}
              type="text"
              name="username"
            />
            {/*password input*/}
            <InputBase
              raised
              className={classes.fastlogin}
              placeholder="Password"
              inputProps={{ onChange: handleInputChange, required: true }}
              type="password"
              name="password"
            />
            {/*login and submit*/}
            <Button
              variant="text"
              raised
              type="submit"
              value="Submit"
              className={classes.login}
            >
              Login
            </Button>

            <Button
              underline="hover"
              className={classes.register}
              onClick={() => setSignup(true)}
              raised
            >
              Sign Up
            </Button>
          </form>
        )}

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
              <Avatar className={classes.avatar}></Avatar>
            </IconButton>
          </Tooltip>
        )}
        {/*Account menu*/}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          className={classes.accountMenu}
          open={openAccountMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              history.push("/account");
            }}
            className={classes.accountMenuItem}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose} className={classes.accountMenuItem}>
            Account Setting
          </MenuItem>
          <MenuItem
            onClick={() => {
              setLogin(false);
              states.login = false;
              setAnchorEl(null);
              history.push("/");
            }}
            className={classes.accountMenuItem}
          >
            Logout
          </MenuItem>
        </Menu>

        {login && (
          <div raised className={classes.username}>
            {`${user.username}`}
          </div>
        )}
        {/*Notifications button*/}
        {login && (
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "notifications" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <NotificationsIcon></NotificationsIcon>
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
      {/*unsuccessful login alert*/}
      <Collapse in={error}>
        <Alert
          severity="error"
          className={classes.errorMsg}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Incorrect username or password, <strong>try again</strong>
        </Alert>
      </Collapse>

      {/*Signup modal*/}
      <Modal open={openSignup} onClose={() => setSignup(false)}>
        <Paper className={classes.signUp}>
          <h1 className={classes.signUpTitle}>Join Locally Imagined</h1>
          <Divider className={classes.divider} />
          <form onSubmit={submitSignup}>
            <InputBase
              className={classes.signUpInput}
              placeholder="First Name"
              inputProps={{
                "data-testid": "firstname",
                onChange: handleInputChange,
                required: true,
              }}
              type="firstname"
              name="firstname"
            />
            <InputBase
              className={classes.signUpInput}
              placeholder="Last Name"
              inputProps={{
                "data-testid": "lastname",
                onChange: handleInputChange,
                required: true,
              }}
              type="lastname"
              name="lastname"
            />
            <InputBase
              className={classes.signUpInput}
              placeholder="Email address"
              inputProps={{
                "data-testid": "email",
                onChange: handleInputChange,
                required: true,
              }}
              type="email"
              name="email"
            />
            <InputBase
              className={classes.signUpInput}
              placeholder="Phone Number"
              inputProps={{
                "data-testid": "telephone",
                onChange: handleInputChange,
                required: true,
              }}
              type="telephone"
              name="telephone"
            />
            <InputBase
              className={classes.signUpInput}
              placeholder="Password"
              inputProps={{
                "data-testid": "password",
                onChange: handleInputChange,
                required: true,
              }}
              type="password"
              name="password"
            />

            <Divider className={classes.divider} />
            <Button
              variant="text"
              raised
              type="submit"
              value="Submit"
              className={classes.signUpButton}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Modal>
    </AppBar>
  );
};

export default Appbar;
