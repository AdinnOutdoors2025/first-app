import React from "react";
import './PreLoad.css';
function Pre(props) {
  return <div id={props.load ? "preloader" : "preloader-none"}>
    {/* // return <div id="preloader"> */}
    {/* MOVING LINE NEWLY ADDED   */}
    <div className="moving-line"></div>
    {/* MOVING LINE NEWLY ADDED   */}

  </div>;
}
export default Pre;
