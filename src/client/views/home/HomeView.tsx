"use client";

import React from "react";

import { Flex, Progress } from "@/client/ui/components";
import FeaturesGridCards from "./FeaturesGridCards";
import HomeDescription from "./HomeDescription";

const HomeView = React.memo(() => {
  return (
    <>
      <Progress.Scrollbar />
      <Flex column>
        {/* Description */}
        <HomeDescription />

        {/* Features Cards */}
        <FeaturesGridCards />

        {/* Others */}
        <Flex style={{ padding: "50px 0px" }}>
          <div style={{ height: "50vh" }} />
        </Flex>
      </Flex>
    </>
  );
});

HomeView.displayName = "HomeView";
export default HomeView;
