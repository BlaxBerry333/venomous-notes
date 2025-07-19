"use client";

import React from "react";

import { Container } from "../Container";
import LayoutBackground from "./LayoutBackground";
import { LayoutStyle } from "./index.styles";

const LayoutMain = React.memo<React.PropsWithChildren>(({ children }) => {
  return (
    <Container
      breakpoint="lg"
      style={{
        marginTop: `${LayoutStyle.Header.height}px`,
      }}
    >
      {children}
      <LayoutBackground />
    </Container>
  );
});
LayoutMain.displayName = "LayoutMain";
export default LayoutMain;
