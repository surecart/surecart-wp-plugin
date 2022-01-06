import React from "react";

export default ({children, required}) => {
  return <small style={{ fontSize: "12px", opacity: '0.5', textTransform: 'uppercase', color: required ? 'red' : 'inherit', fontWeight: 500 }}>{children}</small>
}
