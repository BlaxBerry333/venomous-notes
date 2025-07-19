"use client";

import React from "react";

import { Container } from "../Container";
import { LayoutStyle } from "./index.styles";

const LayoutResult = React.memo<React.PropsWithChildren>(({ children }) => {
  return (
    <Container
      breakpoint="sm"
      style={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100svh - ${LayoutStyle.Header.height}px)`,
        justifyContent: "center",
        alignItems: "center",
        padding: "0px 16px",
      }}
    >
      {children}
    </Container>
  );
});

LayoutResult.displayName = "LayoutResult";
export default LayoutResult;
