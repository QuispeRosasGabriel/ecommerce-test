import React, { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  variant: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({
  content,
  onClick,
  variant,
  ...restProps
}) => (
  <button {...restProps} className={`btn btn-${variant}`} onClick={onClick}>
    {content}
  </button>
);

export default Button;
