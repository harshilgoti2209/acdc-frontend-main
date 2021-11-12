import React from "react";
import { useParams, useHistory } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import EditCard from "../components/EditCard";
import Modal from "react-modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";

import "./EditUser.css";
import { api } from "../constants";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "250px ",
    display: "flex",
    justifyContent: "center",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

function Edituser() {
  let { username } = useParams();
  const history = useHistory();
  const [freeiot, setFreeiot] = React.useState([]);
  const [isSelected, setisSelected] = React.useState("");
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [iot, setIot] = React.useState({
    meta: [],
    data: [],
  });
  const [user, setUser] = React.useState({
    name: "",
    password: "",
  });

  const handleChange = (event) => {
    setisSelected(event.target.value);
  };

  function handleModal() {
    setIsOpen((old) => !old);
  }

  React.useEffect(() => {
    axios.post(api.getuser, { email: username }).then((data) => {
      setUser({ name: data.data.name, password: data.data.password });
    });
    axios.get(api.freeiots).then((data) => {
      setFreeiot(data.data);
    });
    axios
      .post(api.iots, { name: username })
      .then((data) => {
        setIot(data.data);
      })
      .catch((err) => console.error(err));

    return () => {
      setIot({
        meta: [],
        data: [],
      });
      setFreeiot([]);
      setUser({
        name: "",
        password: "",
      });
    };
  }, [username]);

  const createIot = (device) => {
    axios
      .post(api.createiot, {
        name: device,
        user: username,
      })
      .then((data) => {
        if (data.data === "SUCCESS") {
          axios
            .post(api.iots, { name: username })
            .then((data) => {
              setIot(data.data);
            })
            .catch((err) => console.error(err));
        } else {
          window.alert("got some error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveUser = () => {
    axios
      .post(api.updateuser, {
        name: user.name,
        password: user.password,
        email: username,
      })
      .then((data) => {
        if (data.data === "SUCCESS") {
          toast.success("saved successfully!", {
            position: "top-right",
            autoClose: 1750,
            hideProgressBar: true,
          });
        } else {
          window.alert("got some error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const assignIot = (device) => {
    axios
      .post(api.assigniot, {
        name: username,
        device,
      })
      .then((data) => {
        if (data.data === "SUCCESS") {
          axios.get(api.freeiots).then((data) => {
            setFreeiot(data.data);
          });
          axios
            .post(api.iots, { name: username })
            .then((data) => {
              setIot(data.data);
            })
            .catch((err) => console.error(err));
        } else {
          window.alert("got some error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    handleModal();
  };

  return (
    <div
      style={{
        backgroundColor: "hsl(47deg 50% 107%)",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <CssBaseline />
      <Container fixed>
        <Typography component="div" className="edit-user-header">
          <div>
            <Tooltip title="Back">
              <IconButton aria-label="Back" onClick={() => history.goBack()}>
                <KeyboardBackspaceIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <p>{username}</p>
          </div>
          <div>
            <div>
              <TextField
                id="standard-basic"
                label="Name"
                value={user.name}
                onChange={(e) => {
                  setUser((old) => {
                    return { ...old, name: e.target.value };
                  });
                }}
              />
            </div>
            <div>
              <TextField
                id="standard-basic"
                label="Password"
                value={user.password}
                onChange={(e) => {
                  setUser((old) => {
                    return { ...old, password: e.target.value };
                  });
                }}
              />
            </div>
            <Button variant="contained" color="primary" onClick={saveUser}>
              Save
            </Button>
          </div>
          <div>
            <Tooltip title="Add iot">
              <IconButton aria-label="Add iot" onClick={handleModal}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Typography>

        <Typography component="div">
          {iot.meta.map((meta, index) => {
            return (
              <div key={index} className="iot-container-admin">
                <h2>
                  {meta.name}

                  <Tooltip title="Add">
                    <IconButton
                      aria-label="Add"
                      onClick={() => {
                        createIot(meta.name);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </h2>
                <p>{meta.address}</p>
                <div className="iot-body">
                  {iot.data.map((item, index) => {
                    if (item.name === meta.name)
                      return (
                        <EditCard
                          key={index}
                          name={item.name}
                          code={item.code}
                          nick={item.nick}
                          slimit={item.slimit}
                          slevel={item.slevel}
                          sstatus={item.sstatus}
                          mode={item.mode}
                        />
                      );
                    else return null;
                  })}
                </div>
              </div>
            );
          })}
        </Typography>
      </Container>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModal}
          style={customStyles}
          contentLabel="Add Modal"
        >
          <div className="add-iot-modal">
            <div
              style={{
                width: "140px",
              }}
            >
            <FormControl variant="standard" sx={{ m: 1, width: 140 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Device
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={isSelected}
              onChange={handleChange}
            >
              {freeiot.map((data, index) => {
                return (
                  <MenuItem key={index} value={data.name}>
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
            </div>
            <div style={{ marginTop: "3px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  assignIot(isSelected);
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Edituser;
