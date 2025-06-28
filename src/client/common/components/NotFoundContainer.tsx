"use client";

import { memo, type NamedExoticComponent } from "react";
import { Container, Flex, Text } from "venomous-ui";

const NotFoundContainer: NamedExoticComponent = memo(() => {
  return (
    <Container maxWidth="sm">
      <Flex
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Text text="404" isTitle titleLevel="h3" />
        <Text text="Page Not Found" isTitle titleLevel="h5" bold />
        <Text text="The resource requested was not found on this server" bold />
      </Flex>
    </Container>
  );
});

NotFoundContainer.displayName = "NotFoundContainer";
export default NotFoundContainer;
