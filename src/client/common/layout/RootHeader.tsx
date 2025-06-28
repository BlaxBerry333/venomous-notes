"use client";

import { memo, type NamedExoticComponent } from "react";
import { Container, Flex, type ContainerProps } from "venomous-ui";

import LogoTitle from "./LogoTitle";
import RootHeaderActions from "./RootHeaderActions";

export const ROOT_HEADER_HEIGHT = 60;

interface Props {
  maxWidth: ContainerProps["maxWidth"];
}

const RootHeader: NamedExoticComponent<Props> = memo(({ maxWidth }) => {
  return (
    <Container
      component="header"
      maxWidth={maxWidth}
      sx={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 100 }}
    >
      <Flex
        row
        sx={{ height: ROOT_HEADER_HEIGHT, py: "8px", px: "16px", backdropFilter: "blur(10px)" }}
      >
        <LogoTitle />

        <RootHeaderActions />
      </Flex>
    </Container>
  );
});

RootHeader.displayName = "RootHeader";
export default RootHeader;
