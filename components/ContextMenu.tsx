import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import styles from '../styles/context.module.css';

type ContextMenuProps = {
  children: React.ReactNode
  options: {name: string , fn: (() => void)}[]
}

export default function ContextMenu({ children, options } : ContextMenuProps){
  const [anchorPoint, setAnchorPoint] = useState({x: 0, y: 0});
  const display = anchorPoint.x !== 0 && anchorPoint.y !== 0;
  const mouseCoords = useRef({x: 0, y: 0});
  const childRef = useRef<Element>();

  const childElements = React.Children.map(children, child => {
    if(React.isValidElement(child)) return React.cloneElement(child, { ref: childRef })
  })

  const handleClick = useCallback((e: Event) => {
    if(display)
      setAnchorPoint({ x: 0, y: 0 });
  }, [display]);

  const handleContext = useCallback((e: Event) => {
    const childBounds = childRef.current.getBoundingClientRect();
    const mouseInsideChild = mouseCoords.current.x > childBounds.left && mouseCoords.current.x < childBounds.right && mouseCoords.current.y > childBounds.top && mouseCoords.current.y < childBounds.bottom;
    if(display && !mouseInsideChild){
      e.preventDefault();
      setAnchorPoint({ x: 0, y: 0 });
    }
    else{
      if(mouseInsideChild){
        e.preventDefault();
        setAnchorPoint(mouseCoords.current);
      }
    }
  }, [display]);

  const handleMouseMove = (e: MouseEvent) => {
    mouseCoords.current = {
       x: e.clientX, 
       y: e.clientY 
      }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContext);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  });

  const optionIcons = new Map();
  optionIcons.set("select", "➢");
  optionIcons.set("view", "⌗")
  optionIcons.set("invite", "⁂")
  optionIcons.set("send", "🡽");
  optionIcons.set("copy", "❐");
  optionIcons.set("delete", "X");

  return(
    display ?
    <>
      <ul
        style={{
          left: anchorPoint.x,
          top: anchorPoint.y,
        }}
        id={styles.contextMenu}
        className={styles.showContextMenu}
        onClick={(e) => e.stopPropagation()}
      >
        {
          options.map(option => {
            return(
              <li key={option.name}>
                <button 
                  key={option.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    option.fn();
                    setAnchorPoint({ x: 0, y: 0 });
                  }}
                >
                  <p>{optionIcons.get(option.name)}</p>
                  <p>{option.name}</p>
                </button>
              </li>
            )
          })
        }
      </ul>
      {childElements}
    </>
    :
    <>{childElements}</>
  )
};