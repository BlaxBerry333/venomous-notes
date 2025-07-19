import type { IconProps as IconifyIconProps } from "@iconify/react";

import { IconColors } from "../../utils";

export interface IconProps extends IconifyIconProps {
  color?: keyof typeof IconColors;
}
