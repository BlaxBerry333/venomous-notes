"use client";

import React from "react";
import { Container } from "venomous-ui-react/components";

import LayoutBackground from "./LayoutBackground";
import { LayoutStyle } from "./index.styles";

const LayoutMain = React.memo<React.PropsWithChildren>(({ children }) => {
  return (
    <Container
      breakpoint="lg"
      style={{
        marginTop: `${LayoutStyle.Header.height}px`,
        backgroundColor: "transparent",
      }}
    >
      {children}
      <LayoutBackground />
    </Container>
  );
});
LayoutMain.displayName = "LayoutMain";
export default LayoutMain;
