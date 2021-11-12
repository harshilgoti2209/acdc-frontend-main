import React from "react";

export default function Status({ status }) {
  status === 1 ? (status = "green") : (status = "red");
  return (
    <div
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "20px",
        backgroundColor: status,
        display:'inline-block',
        marginLeft:'5px'
      }}
    ></div>
  );
}
