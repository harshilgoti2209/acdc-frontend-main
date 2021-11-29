import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from '@mui/material/Button';
import { api } from "../constants";
import { toast } from "react-toastify";
import axios from "axios";
export default function Setting({ name, nick, code, show }) {
    const [data, setData] = React.useState({
        name,
        nick,
        code,
        show,
    });
    const handleChange = (key) => (event) => {
        if (key === "nick") {
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
    const save = () => {
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
    return (
        <>
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
                />
            </div>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={data.show ? true : false}
                            onChange={handleChange("show")}
                            color="primary"
                        />
                    }
                    label="show"
                />
                <Button variant="contained" onClick={save}>Edit</Button>
            </div></>
    )
}