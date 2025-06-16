"use client";

import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";
import { Container, type ContainerProps } from "venomous-ui";

import BackgroundImage from "./BackgroundImage";
import { ROOT_HEADER_HEIGHT } from "./RootHeader";

interface Props extends PropsWithChildren {
  maxWidth: ContainerProps["maxWidth"];
}

const RootMain: NamedExoticComponent<Props> = memo(({ children, maxWidth }) => {
  return (
    <Container
      component="main"
      maxWidth={maxWidth}
      sx={{
        position: "relative",
        py: "8px",
        px: "16px",
        height: `calc(100svh - ${ROOT_HEADER_HEIGHT}px - 16px)`,
        width: "100%",
      }}
    >
      <BackgroundImage />

      {children}
    </Container>
  );
});

RootMain.displayName = "RootMain";
export default RootMain;
