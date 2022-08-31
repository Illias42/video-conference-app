// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import Resizer from './resizer';

const baseStyles = {
  position: "relative",
  transition: "width 0.3s"
};

const Sidebar = (props: any) => {
  const minWidth = Math.min(...Object.values(props.sizes).map((v) => v.width));
  const maxWidth = Math.max(...Object.values(props.sizes).map((v) => v.width));

  const [ isResizing, setIsResizing ] = useState(false);
  const [ resizeDelta, setResizeDelta ] = useState(0);
  const [ width, setWidth ] = useState(maxWidth);

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (props.expand) {
      setWidth(maxWidth);
    } else {
      setWidth(minWidth);
    }
  }, [props.expand, minWidth, maxWidth]);
  
  const onResize = (resizeDelta: number) => {
    setIsResizing(true);
    setResizeDelta(resizeDelta);
  }

  const onResizeEnd = (resizeDelta: number) => {
    setIsResizing(false);
    setResizeDelta(0);
    setWidth(getFinalWidth(resizeDelta));
  }

  const getFinalWidth = (resizeDelta: number) => {
    const tempwidth = Math.max(width - resizeDelta);
    const isShrinking = resizeDelta > 0;
    const sizes = isShrinking
      ? Object.values(props.sizes).reverse()
      : Object.values(props.sizes);

    const sizeMatch = sizes.find((size) => 
      isShrinking ? size.width <= tempwidth : size.width >= tempwidth
    );

    if (sizeMatch && sizeMatch.shouldSnap) {
      console.log("sizeMatch", sizeMatch);
      return sizeMatch.width;
    } else {
      console.log("width", width);
      return width;
    }
  };

  const getProgressWidth = (resizeDelta) => {
    const progressWidth = width - resizeDelta;
    if (progressWidth >= maxWidth) {
      return maxWidth;
    } else if (progressWidth <= minWidth) {
      return minWidth;
    }

    return progressWidth;
  };

  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      width: width
    });
  });
  
  return (
    <div ref={sidebarRef} style={{
      ...baseStyles,
      width: `${getProgressWidth(resizeDelta)}px`,
      transition: !isResizing ? "0.3s all" : ""
    }}>
      <Resizer onResize={onResize} onResizeEnd={onResizeEnd} />
      <div>{children}</div>
    </div>
  );
};

Sidebar.defaultProps = {
  sizes: [
    {
      width: 80,
      shouldSnap: true
    },
    {
      width: 320,
      shouldSnap: true
    }
  ],
  expand: true
};

export default Sidebar;