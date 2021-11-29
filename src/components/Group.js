import React from 'react'
import './Group.css'
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from '@mui/material/Button';
import { toast } from "react-toastify";
import { api } from "../constants";
import axios from "axios";

export default function Group({ item, index }) {
    const [data, setData] = React.useState("");
    const handleChange = (event) => {
        setData((old) =>
            +event.target.value
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1")
        );
    }
    const set = () => {
        if (+data > item.limit) {
            toast.error(`exceed the limit (${item.limit}) `, {
                position: "top-right",
                autoClose: 1750,
                hideProgressBar: true,
            });
        }
        else {
            axios
                .post(api.setgroup, { start: item.start, end: item.end, value: +data })
                .then(() => {
                    toast.success(`success`, {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                })
                .catch((err) => toast.error(`error in network`, {
                    position: "top-right",
                    autoClose: 1750,
                    hideProgressBar: true,
                }));
        }
    }
    const on = () => {
        axios
                .post(api.ongroup, { start: item.start, end: item.end})
                .then(() => {
                    toast.success(`success`, {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                })
                .catch((err) => toast.error(`error in network`, {
                    position: "top-right",
                    autoClose: 1750,
                    hideProgressBar: true,
                }));
    }
    const off = () => {
        axios
                .post(api.offgroup, { start: item.start, end: item.end})
                .then(() => {
                    toast.success(`success`, {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                })
                .catch((err) => toast.error(`error in network`, {
                    position: "top-right",
                    autoClose: 1750,
                    hideProgressBar: true,
                }));
    }
    if (item.show) {
        return (
            <div className='group-containers' >
                <div><h2>{item.name}</h2><h4>From {item.start} to {item.end}</h4></div>
                <div>
                    <div>
                        <FormControlLabel
                            style={{
                                marginLeft: "5px",
                            }}
                            control={
                                <TextField
                                    id="standard-basic"
                                    value={data}
                                    onChange={handleChange}
                                    variant="standard"
                                    placeholder="Value"
                                />
                            }
                        />
                    </div>
                    <div>
                        <Button variant="contained" onClick={set}>Set</Button>
                    </div>
                </div>
                <div>
                    <div>
                        <Button variant="contained" onClick={on}>ON</Button>
                    </div>
                    <div >
                        <Button variant="contained" onClick={off}>OFF</Button>
                    </div >
                </div >
            </div >
        )
    }
    else {
        return <></>
    }
}
