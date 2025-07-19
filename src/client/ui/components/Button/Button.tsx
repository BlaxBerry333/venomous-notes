"use client";

import React from "react";

import { useThemeColor } from "../../hooks";
import { ButtonColors, IconColors } from "../../utils";
import { Icon } from "../Icon";
import { Typography, TypographyStyle } from "../Typography";
import type { ButtonProps } from "./index.types";

const Button = React.memo<ButtonProps>(
  ({
    style,
    text,
    variant = "container",
    color = "auto",
    isLoading,
    isDisabled,
    icon,
    iconPosition = "start",
    iconWidth = 20,
    iconColor = "auto",
    ...props
  }) => {
    const { themeColor } = useThemeColor();

    const buttonColor = color !== "auto" ? ButtonColors[color] : themeColor;

    return (
      <button
        disabled={isLoading || isDisabled}
        style={{
          height: "40px",
          display: "flex",
          flexDirection: iconPosition === "start" ? "row" : "row-reverse",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "capitalize",
          fontSize: TypographyStyle.size.text,
          fontWeight: "bold",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          ...(text
            ? {
                width: "auto",
                padding: "0px 16px",
              }
            : {
                width: "40px",
                padding: "0px 0px",
              }),
          ...(variant === "container"
            ? {
                backgroundColor: buttonColor,
                color: "#ffffff",
                boxShadow: "rgba(0, 0, 0, 0.14) 0px 6px 10px 0px",
              }
            : {}),
          ...(variant === "outline"
            ? {
                color: buttonColor,
                backgroundColor: "transparent",
                border: `1px solid ${buttonColor}`,
              }
            : {}),
          ...(variant === "ghost"
            ? {
                color: buttonColor,
                backgroundColor: "transparent",
              }
            : {}),
          ...style,
        }}
        {...props}
      >
        {/* icon */}
        {icon && (
          <Icon
            icon={icon}
            width={iconWidth}
            style={{
              color: variant === "container" ? IconColors.white : IconColors[iconColor] || "inherit",
            }}
          />
        )}

        {/* text */}
        {text && (
          <Typography.Text
            text={text}
            style={{
              margin: icon ? "0px 8px" : "0px",
              color: variant === "container" ? "#ffffff" : "inherit",
            }}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;

{
  /* <Button />
<Button text="Test" />
<Button text="Test" color="error" />
<Button text="Test" variant="outline" />
<Button text="Test" icon="solar:info-square-line-duotone" />
<Button text="Test" icon="solar:info-square-line-duotone" variant="outline" />
<Button text="Test" icon="solar:info-square-line-duotone" iconPosition="end" />
<Button icon="solar:info-square-line-duotone" />
<Button icon="solar:info-square-line-duotone" variant="ghost" />
<Button icon="solar:info-square-line-duotone" variant="outline" />
<Button text="Test" variant="ghost" />
<Button text="Test" variant="ghost" color="error" />
<Button text="Test" variant="outline" color="error" />
<Button text="Test" icon="solar:info-square-line-duotone" color="error" />
<Button text="Test" icon="solar:info-square-line-duotone" variant="outline" color="error" />
<Button icon="solar:info-square-line-duotone" variant="ghost" color="error" />
<Button icon="solar:info-square-line-duotone" variant="outline" color="error" />  
  */
}
