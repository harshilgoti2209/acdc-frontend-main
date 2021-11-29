import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import { api } from "../constants";
import axios from 'axios';
import { useSelector } from "react-redux";
import './Setting.css'
import EditName from '../components/EditName'
import EditGroup from "../components/EditGroup";
export default function Setting() {
    const email = useSelector((state) => state.user.email);
    const [data, setData] = React.useState({
        name: "",
        start: "",
        end: "",
        limit: "",
        user: email,
        show: 0
    });

    const [iot, setIot] = React.useState({
        meta: [],
        data: [],
    });

    const [group, setGroup] = React.useState([]);

    React.useEffect(() => {
        axios
            .post(api.iots, { name: email })
            .then((data) => {
                setIot(data.data);
            })
            .catch((err) => console.error(err));
        axios
            .post(api.getgroup, { user: email })
            .then((data) => {
                setGroup(data.data)
            })
            .catch((err) => console.error(err));
        return () => {
            setIot({
                meta: [],
                data: [],
            });
            setGroup([]);
        }
    }, [email])

    const handleChange = (key) => (event) => {
        if (key === "start" || key === "end" || key === "limit") {
            setData((old) => ({
                ...old,
                [key]: +event.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*?)\..*/g, "$1"),
            }));
        } else if (key === "name") {
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

    const onSave = () => {
        if (data.name !== "" && data.limit !== "" && data.start !== "" && data.end !== "") {
            axios
                .post(api.savegroup, data)
                .then(() => {
                    toast.success("saved successfully!", {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                    axios
                        .post(api.getgroup, { user: email })
                        .then((data) => {
                            setGroup(data.data)
                        })
                        .catch((err) => console.error(err));
                    setData({
                        name: "",
                        start: "",
                        end: "",
                        limit: "",
                        user: email,
                        show: 0
                    })
                })
                .catch(() => {
                    toast.error("Failed!", {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                });
        } else {
            toast.error("Enter the fields!", {
                position: "top-right",
                autoClose: 1750,
                hideProgressBar: true,
            });
        }
    };

    const onEdit = (data) => {
        if (data.name !== "" && data.limit !== "" && data.start !== "" && data.end !== "") {
            axios
                .post(api.editgroup, data)
                .then(() => {
                    toast.success("edited successfully!", {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                })
                .catch(() => {
                    toast.error("Failed!", {
                        position: "top-right",
                        autoClose: 1750,
                        hideProgressBar: true,
                    });
                });
        } else {
            toast.error("Enter the fields!", {
                position: "top-right",
                autoClose: 1750,
                hideProgressBar: true,
            });
        }
    }
    const onDelete = (_id) => {
        axios
            .post(api.deletegroup, { _id })
            .then(() => {
                toast.success("deleted successfully!", {
                    position: "top-right",
                    autoClose: 1750,
                    hideProgressBar: true,
                });
                axios
                    .post(api.getgroup, { user: email })
                    .then((data) => {
                        setGroup(data.data)
                    })
                    .catch((err) => console.error(err));
            })
            .catch(() => {
                toast.error("Failed!", {
                    position: "top-right",
                    autoClose: 1750,
                    hideProgressBar: true,
                });
            });
    }

    return <div>
        <div className='setting-container'>
            <div>Name</div>
            <div className='editname-container'>
                {iot.meta.map((meta, index) => {
                    return (
                        <div key={index}>
                            <h4>
                                {meta.id} .
                                {meta.name}
                            </h4>
                            {iot.data.map((item, index) => {
                                if (item.name === meta.name)
                                    return (
                                        <EditName nick={item.nick} name={item.name} code={item.code} show={item.show} key={item.name + index} />
                                    )
                                else return null;
                            })}

                        </div>
                    );
                })}
            </div>
            <div className='setting-container'>
                <div>Group</div>
                <div className='group-form'>
                    <div>
                        <FormControlLabel
                            style={{
                                marginLeft: "5px",
                            }}
                            control={
                                <TextField
                                    id="standard-basic"
                                    value={data.name}
                                    onChange={handleChange("name")}
                                    variant="standard"
                                    placeholder="Name"
                                />
                            }

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
                                    value={data.start}
                                    onChange={handleChange("start")}
                                    variant="standard"
                                    placeholder="Starting_range"
                                />
                            }

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
                                    value={data.end}
                                    onChange={handleChange("end")}
                                    variant="standard"
                                    placeholder="Ending_range"
                                />
                            }

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
                                    value={data.limit}
                                    onChange={handleChange("limit")}
                                    variant="standard"
                                    placeholder="limit"
                                />
                            }

                        />
                    </div>
                    <div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.show ? true : false}
                                    color="primary"
                                    onChange={handleChange("show")}
                                />
                            }
                            label="Show"
                        />
                    </div>
                    <div>
                        <Button variant="contained" color="primary" onClick={onSave}>
                            Save
                        </Button>
                    </div>
                </div>
                <div className='group-container'>
                    {group.map((item, index) => {
                        return <EditGroup key={index} item={item} onDelete={onDelete} onEdit={onEdit} />
                    })}
                </div>
            </div>
            <ToastContainer />
        </div>
    </div>;
}
