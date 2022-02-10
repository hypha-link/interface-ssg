import React, { useEffect, useState } from "react";
import styles from "../../styles/tooltip.module.css"

export enum Direction{
    top = "top",
    right = "right",
    left = "left",
    bottom = "bottom",
}

export const Tooltip = (props) => {
const { content, direction, delay }: 
{
    content: string,
    direction: Direction,
    delay: number,
} = props;
//Tracks mouse entering/leaving container
const [active, setActive] = useState(false);
//Whether we display the tooltip
const [display, setDisplay] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if(active && content){
      timeout = setTimeout(() => {
        setDisplay(true);
      }, delay || 1200);
    }
    return () => {
      clearInterval(timeout);
      setDisplay(false);
    }
  }, [active])

  return (
    <div
      className={styles.tooltipWrapper}
      // When to show the tooltip
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {/* Wrapping */}
      {props.children}
      {display && (
        <div className={`${styles.tooltip} ${styles[direction] || styles[Direction.top]}`}>
          {content}
        </div>
      )}
    </div>
  );
};