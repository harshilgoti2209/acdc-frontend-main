import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import "./Iot.css";
import axios from "axios";
import { api } from "../constants";
import { ToastContainer } from "react-toastify";

export default function Iot() {
  const [iot, setIot] = useState({
    meta: [],
    data: [],
  });
  const data = () => {
    axios
      .post(api.iots, { name: localStorage.getItem("email") })
      .then((data) => {
        // console.log(data.data);
        setIot(data.data);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    data();
    setInterval(data, 1000);
    return () => {
      setIot({ meta: [], data: [] });
    };
  }, []);
  return (
    <div className="iot-box">
      {iot.meta.map((meta, index) => {
        return (
          <div key={index} className="iot-container">
            <h2>{meta.name}</h2>
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
      <ToastContainer/>
    </div>
  );
}
