import React from "react";

import { BreakPointWidth } from "../../utils";
import { ContainerProps } from "./Container.types";

const Container = React.memo<ContainerProps>(({ children, breakpoint = "lg", style, ...props }) => {
  const maxWidth = React.useMemo<React.CSSProperties["maxWidth"]>(() => BreakPointWidth[breakpoint], [breakpoint]);

  return (
    <div
      style={{
        margin: "0 auto",
        width: "100%",
        maxWidth,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = "Container";
export default Container;
