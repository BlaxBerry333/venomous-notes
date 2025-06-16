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
    <Container component="main" maxWidth={maxWidth}>
      <Flex row sx={{ height: ROOT_HEADER_HEIGHT, py: "8px", px: "16px" }}>
        <LogoTitle />

        <RootHeaderActions />
      </Flex>
    </Container>
  );
});

RootHeader.displayName = "RootHeader";
export default RootHeader;
