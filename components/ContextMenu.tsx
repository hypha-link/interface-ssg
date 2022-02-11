import { useState, useCallback, useEffect } from "react";
import styles from '../styles/Context.module.css';

const ContextMenu = (props) => {
  const [anchorPoint, setAnchorPoint] = useState(props.anchorPoint);
  const [validProps, setValidProps] = useState<any[]>();
  const display = anchorPoint.x !== 0 && anchorPoint.y !== 0;

  const handleClick = useCallback(() => {
    setAnchorPoint({ x: 0, y: 0 });
    if(display)
    props.localAnchorPoint({ x: 0, y: 0 });
  }, [props, display]);
  const handleContext = useCallback(() => {
    setAnchorPoint({ x: 0, y: 0 });
    if(display){
        props.localAnchorPoint({ x: 0, y: 0 });
    }
  }, [props, display]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContext);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContext);
    };
  });

  useEffect(() => {
      setAnchorPoint(props.anchorPoint);
  }, [props.anchorPoint])

  useEffect(() => {
      const validProps = [];
      let count = 0;
      Object.values(props).forEach((prop) => {
          if(typeof(prop) === 'function' && Object.keys(props)[count] !== "localAnchorPoint"){
              validProps.push(Object.keys(props)[count]);
          }
          count++;
      })
      setValidProps(validProps);
  }, [setValidProps, props])

  const style = () => {
    return {
      left: anchorPoint.x,
      top: anchorPoint.y,
    };
  };

  const optionIcons = new Map();
  optionIcons.set("select", "➢");
  optionIcons.set("view", "⌗")
  optionIcons.set("invite", "⁂")
  optionIcons.set("send", "🡽");
  optionIcons.set("copy", "❐");
  optionIcons.set("delete", "X");

  if (display) {
    return (
      <ul
        style={style()}
        id={styles.contextMenu}
        className={styles.showContextMenu}
        onClick={(e) => e.stopPropagation()}
      >
        {validProps.map((prop) => {
            return (
                <li key={prop}>
                <button
                    key={prop}
                    onClick={(e) => {
                    e.stopPropagation();
                    //This is not a error, silly typescript
                    props[prop]();
                    setAnchorPoint({ x: 0, y: 0 });
                    props.localAnchorPoint({ x: 0, y: 0 });
                    }}
                >
                    <p>{optionIcons.get(prop)}</p>
                    <p>{prop}</p>
                </button>
                </li>
            );
        })}
      </ul>
    );
  }

  return <></>;
};

export default ContextMenu;
