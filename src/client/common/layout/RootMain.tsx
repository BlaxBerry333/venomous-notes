"use client";

import { memo, type NamedExoticComponent, type PropsWithChildren } from "react";
import { Container, type ContainerProps } from "venomous-ui";

import BackgroundImage from "./BackgroundImage";

interface Props extends PropsWithChildren {
  maxWidth: ContainerProps["maxWidth"];
}

const RootMain: NamedExoticComponent<Props> = memo(({ children, maxWidth }) => {
  return (
    <Container
      component="main"
      maxWidth={maxWidth}
      // sx={{ height: `calc(100svh - ${ROOT_HEADER_HEIGHT}px)` }}
    >
      <BackgroundImage />

      {children}
    </Container>
  );
});

RootMain.displayName = "RootMain";
export default RootMain;
