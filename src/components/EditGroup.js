import React from 'react'
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@mui/material/TextField';
export default function EditGroup({ item, onEdit, onDelete }) {
    const [data, setData] = React.useState({
        name: item.name,
        start: item.start,
        end: item.end,
        limit: item.limit,
        _id: item._id,
        show: item.show
    });
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
    return (
        <div style={{
            backgroundColor: 'rgb(243, 243, 243)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            border: '1px solid rgb(63, 63, 63)',
            borderRadius: '3px',
            margin: '4px',
            padding: '3px'
        }}>
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
                            value={data.start}
                            onChange={handleChange("start")}
                            variant="standard"
                            placeholder="start"
                        />
                    }
                    label="start"
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
                            placeholder="end"
                        />
                    }
                    label="end"
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
                    label="limit"
                />
            </div>

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
            <CheckIcon onClick={() => {
                onEdit(data);
            }} />
            <DeleteIcon onClick={() => { onDelete(item._id) }} />
        </div>
    )
}
