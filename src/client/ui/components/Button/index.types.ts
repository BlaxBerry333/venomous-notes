import { ButtonColors } from "../../utils";
import { IconProps } from "../Icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "container" | "outline" | "ghost";
  color?: keyof typeof ButtonColors;

  isLoading?: boolean;
  isDisabled?: boolean;

  icon?: IconProps["icon"];
  iconPosition?: "start" | "end";
  iconWidth?: IconProps["width"];
  iconColor?: IconProps["color"];
}
