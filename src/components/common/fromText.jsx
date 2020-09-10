import React from "react";

const Text = ({ name, label, value }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <span id={name} className="form-control" >{value}</span>
    </div>
  );
};

export default Text;
