import React from 'react';
import '../App.css';
type ButtonProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
};
const Button = ({ children, onClick, style }: ButtonProps) => {
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
