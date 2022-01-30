import React, { useState } from "react";
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
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 600);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className={styles.tooltipWrapper}
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`${styles.tooltip} ${styles[direction] || styles[Direction.top]}`}>
          {/* Content */}
          {content}
        </div>
      )}
    </div>
  );
};