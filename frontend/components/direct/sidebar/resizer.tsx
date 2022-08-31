/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { Component, useState } from "react";
import rafSchedule from "raf-schd";

const styles = {
  cursor: "ew-resize",
  height: "100%",
  position: "absolute",
  right: "0",
  width: "4px",
  backgroundColor: "rgba`(0, 0, 0, 0)"
};

class Resizer extends Component {

  static defaultProps = {
    onResizeStart: () => {},
    onResize: () => {},
    onResizeEnd: () => {}
  };

  static resizerClickableWidth = 20;

  state = {
    startScreenX: 0,
    isResizing: false
  };

  _scheduleResize = rafSchedule((delta) => {
    if (this.state.isResizing && delta) {
      this.props.onResize(delta);
    }
  });

  _mouseUpHandler = (e, outOfBounds = false) => {
    window.removeEventListener("mousemove", this._mouseMoveHandler);
    window.removeEventListener("mouseup", this._mouseUpHandler);
    window.removeEventListener("mouseout", this.handleOutofBounds);
    this.setState({
      isResizing: false
    });

    const screenX = outOfBounds
      ? e.screenX - 2 * Resizer.resizerClickableWidth
      : e.screenX;

    const delta = this.state.startScreenX - screenX;

    if (delta === 0) {
      return;
    }

    this.props.onResize(delta);

    this.props.onResizeEnd(delta);
  };

  _mouseMoveHandler = (e) => {
    this._scheduleResize(this.state.startScreenX - e.screenX);
  };

  _mouseDownHandler = (e) => {
    e.preventDefault();

    if (this.state.isResizing) {
      return;
    }

    this.setState({
      isResizing: true,
      startScreenX: e.screenX
    });
    this.props.onResizeStart();
    window.addEventListener("mousemove", this._mouseMoveHandler);
    window.addEventListener("mouseup", this._mouseUpHandler);
    window.addEventListener("mouseout", this.handleOutofBounds);
  };

  render() {
    return <div style={styles} onMouseDown={this._mouseDownHandler} />;
  }
}


// const Resizer = (props) => {

//   const resizerClickableWidth = 20;

//   const [ startScreenX, setStartScreenX ] = useState(0);
//   const [ isResizing, setIsResizing ] = useState(false);

//   const scheduleResize = rafSchedule((delta) => {
//     console.log("isResizing delta", isResizing, delta);
//     if (delta) {
//       props.onResize(delta);
//     }
//   });

//   const mouseUpHandler = (e, outOfBounds = false) => {
//     window.removeEventListener("mousemove", mouseMoveHandler);
//     window.removeEventListener("mouseup", mouseUpHandler);
//     // window.removeEventListener("mouseout", handleOutofBounds);
//     setIsResizing(false);

//     const screenX = outOfBounds
//       ? e.screenX - 2 * resizerClickableWidth
//       : e.screenX;

//     const delta = startScreenX - screenX;

//     console.log("resizer", delta);

//     if (delta === 0) {
//       return;
//     }

//     props.onResize(delta);
//     props.onResizeEnd(delta);
//   };

//   const mouseMoveHandler = (e) => {
//     scheduleResize(startScreenX - e.screenX);
//   };

//   const mouseDownHandler = (e) => {
//     e.preventDefault();
//     console.log("mouseDownHandler", e);
//     if (isResizing) {
//       return;
//     }
//     console.log("mouseDownHandler isResizing", isResizing);
//     setIsResizing(() => true);
//     console.log("mouseDownHandler isResizing 1", isResizing);
//     setStartScreenX(e.screenX);
//     // props.onResizeStart();
//     window.addEventListener("mousemove", mouseMoveHandler);
//     window.addEventListener("mouseup", mouseUpHandler);
//   }

//   return (
//     <div style={styles} onMouseDown={mouseDownHandler} />
//   )

// }

// Resizer.defaultProps = {
//   onResizeStart: () => {},
//   onResize: () => {},
//   onResizeEnd: () => {}
// };

export default Resizer;
