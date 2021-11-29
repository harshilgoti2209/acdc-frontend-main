import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { api } from "../constants";

export default function Logs() {
  const [log, setLog] = useState([]);

  const getData = () => {
    axios
      .get(api.logs)
      .then((data) => {
        setLog(data.data.sort((a,b)=>b.time-a.time));
      })
      .catch((err) => console.error(err));
  };

  const unixToDate = (num) => {
    const milliseconds = Number.parseInt(num, 10) * 1000;
    return new Date(milliseconds).toLocaleString();
  };

  useEffect(() => {
    getData();
    const intervalId = setInterval(getData, 10000);
    return () => {
      clearInterval(intervalId);
      setLog([])
    };
  },[]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Sender</TableCell>
              <TableCell align="center">Log</TableCell>
              <TableCell align="center">Time</TableCell>
              <TableCell align="center">UnixTime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {log.map((row, index) => (
              <TableRow key={index} style={{backgroundColor:row.name==='server'?'rgb(231 231 231 / 87%)':''}}>
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.log}</TableCell>
                <TableCell align="center">{unixToDate(row.time)}</TableCell>
                <TableCell align="center">{row.time}</TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
