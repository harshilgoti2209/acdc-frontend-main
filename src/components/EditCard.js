import React from "react";
import axios from "axios";
import { api } from "../constants";
import Button from "@material-ui/core/Button";
import "./EditCard.css";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

const EditCard = ({ name, nick, code, mode, slimit, slevel, sstatus }) => {
  const [data, setData] = React.useState({
    name,
    nick,
    code,
    mode,
    sstatus,
    slevel,
    slimit,
  });

  const onSave = () => {
    axios
      .post(api.saveiot, data)
      .then(() => {
        toast.success("saved successfully!", {
          position: "top-right",
          autoClose: 1750,
          hideProgressBar: true,
        });
      })
      .catch(() => {
        toast.error("Failed!",{
          position:"top-right",
          autoClose: 1750,
          hideProgressBar: true,
        });
      });
  };

  const handleChange = (key) => (event) => {
    if (key === "slimit") {
      setData((old) => ({
        ...old,
        [key]: event.target.value
          .replace(/[^0-9.]/g, "")
          .replace(/(\..*?)\..*/g, "$1"),
      }));
    } else if (key === "nick") {
      setData((old) => ({
        ...old,
        [key]: event.target.value,
      }));
    } else {
      setData((old) => ({
        ...old,
        [key]: event.target.checked ? 1 : 0,
      }));
    }
  };

  return (
    <div className="editcard">
      <div className="header-editcard">
        <p>{code}</p>
      </div>
      <div className="body-editcard">
        <div>
          <FormControlLabel
            style={{
              marginLeft: "5px",
            }}
            control={
              <TextField
                id="standard-basic"
                value={data.nick}
                onChange={handleChange("nick")}
                variant="standard"
                placeholder="Name"
              />
            }
            label="name"
          />
        </div>
        <div>
          <FormControlLabel
            style={{
              marginLeft: "5px",
            }}
            control={
              <TextField
                id="standard-basic"
                value={data.slimit}
                onChange={handleChange("slimit")}
                variant="standard"
                placeholder="limit"
              />
            }
            label="limit"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.sstatus ? true : false}
                onChange={handleChange("sstatus")}
                color="primary"
              />
            }
            label="Status"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.slevel ? true : false}
                color="primary"
                onChange={handleChange("slevel")}
              />
            }
            label="Level"
          />
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.mode ? true : false}
                color="primary"
                onChange={handleChange("mode")}
              />
            }
            label="Add mode"
          />
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCard;
