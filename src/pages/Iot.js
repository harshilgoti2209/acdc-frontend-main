import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import "./Iot.css";
import axios from "axios";
import Group from "../components/Group";
import { api } from "../constants";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
export default function Iot() {
  const email = useSelector((state) => state.user.email);
  const [iot, setIot] = useState({
    meta: [],
    data: [],
  });
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [group, setGroup] = React.useState([]);
  const data = () => {
    axios
      .post(api.iots, { name: email })
      .then((data) => {
        setIot(data.data);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    data();
    axios
      .post(api.getgroup, { user: email })
      .then((data) => {
        setGroup(data.data)
      })
      .catch((err) => console.error(err));
    setInterval(data, 1000);
    return () => {
      setIot({ meta: [], data: [] });
    };
  }, []);
  return (
    <div className="iot-box">
      <div className='iot-container'>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Groups" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {group.map((item, index) => {
              return <ListItemButton sx={{ pl: 4 }} key={index}>
                <Group item={item} index={index} />
              </ListItemButton>
            })}
          </List>
        </Collapse>

      </div>
      {iot.meta.map((meta, index) => {
        return (
          <div key={index} className="iot-container">
            <h2>{meta.id}. {meta.name}</h2>
            <div className='iot-body'>
              {iot.data.map((item, index) => {
                if (item.name === meta.name)
                  return (
                    <Card
                      key={index}
                      name={item.name}
                      code={item.code}
                      nick={item.nick}
                      actived={meta.actived}
                      limit={item.limit}
                      level={item.current}
                      status={item.status}
                      sstatus={item.sstatus}
                      slevel={item.slevel}
                      slimit={item.slimit}
                      percent={item.percent}
                    />
                  );
                else return null;
              })}
            </div>
          </div>
        );
      })}
      <ToastContainer />
    </div>
  );
}
