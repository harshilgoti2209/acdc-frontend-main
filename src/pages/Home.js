import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Login from "./Login";
import { api } from "../constants";

export default function Home() {
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const email = window.localStorage.email;
    const user = await axios.post(api.getuser, { email });
    dispatch({
      type: "set",
      email: user.data.email,
      name: user.data.name,
      role: user.data.role,
    });
  };
  React.useEffect(fetchUser);

  switch (role) {
    case 0:
      return <AdminDashboard />;
    case 1:
      return <UserDashboard />;
    default:
      return <Login />;
  }
}
