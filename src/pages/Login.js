import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";

import "./Login.css";
import { url } from "../constants";
import axios from "axios";

function Login() {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = () => {
    axios
      .post(url + "login", {
        email: values.email,
        password: values.password,
      })
      .then((data) => {
        dispatch({
          type: "set",
          role: data.data.role,
          name: data.data.name,
          email: data.data.email,
        });
        window.localStorage.setItem("email", values.email);
      })
      .catch((err) => {
        toast.error("Incorrect email/password or network error", {
          position: "top-right",
          autoClose: 2050,
          hideProgressBar: true,
        });
      });
  };

  return (
    <div className="login">
      <form
        autoComplete="off"
        style={{ displat: "flex", flexDirection: "column" }}
      >
        <div>
          <TextField
            label="Email"
            value={values.email}
            style={{ width: "250px" }}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <FormControl>
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}

export default React.memo(Login);
