import React, { useState } from "react";
import "./Card.css";
import Status from "./Status";
import { CircleProgress } from "react-gradient-progress";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { api } from "../constants";
import Done from "../assets/done.svg";
import { toast } from "react-toastify";

const Card = ({
  name,
  nick,
  code,
  actived,
  limit,
  level,
  status,
  sstatus,
  slevel,
  slimit,
  percent,
}) => {
  const [limiT, setLimit] = useState(limit);
  const changeStatus = () => {
    axios
      .post(api.url, {
        name: name,
        status: status === 1 ? 0 : 1,
        subName: code,
        code: "SW",
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const changeLimit = () => {
    if (+limiT > slimit) {
      toast.error(`Exceed limit(${slimit})`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }
    axios
      .post(api.url, {
        name: name,
        limit: limiT,
        subName: code,
        code: "SC",
      })
      .then((e) => {
        console.log(e);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="card">
      <div className="header">
        <h3>
          {nick}
          <Status status={actived} />
        </h3>
      </div>
      <div className="card-body">
        <div className="progress">
          <CircleProgress
            percentage={parseFloat((percent * 100).toFixed(1)) || 0}
            width={130}
            primaryColor={["#f542e3", "#425af5"]}
          />
        </div>

        <div className="iot-info">
          {status === 1 ? (
            <div>
              <Input
                placeholder="limit"
                disabled
                value={limit}
                className="limit"
              />
            </div>
          ) : (
            <div>
              <Input
                placeholder="limit"
                className="limit"
                value={limiT}
                onChange={(e) => {
                  setLimit(
                    e.target.value
                      .replace(/[^0-9.]/g, "")
                      .replace(/(\..*?)\..*/g, "$1")
                  );
                }}
              />
              <Button
                variant="contained"
                color="primary"
                component="span"
                className="done"
                onClick={changeLimit}
              >
                <img src={Done} alt="done" />
              </Button>
            </div>
          )}
          <div>
            <p>Limit : {limit}</p>
            <p>Level : {level}</p>
            <Button
              variant="contained"
              color="primary"
              component="span"
              className="start"
              onClick={changeStatus}
            >
              {status === 1 ? "off" : "on"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
