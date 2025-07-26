"use client";

import React from "react";
import { Progress, Space } from "venomous-ui-react/components";

import FeaturesGridCards from "./FeaturesGridCards";
import HomeDescription from "./HomeDescription";

const HomeView = React.memo(() => {
  return (
    <>
      <Progress.Scrollbar />
      <Space.Flex column>
        {/* Description */}
        <HomeDescription />

        {/* Features Cards */}
        <FeaturesGridCards />

        {/* Others */}
        <Space.Flex style={{ padding: "50px 0px" }}>
          <div style={{ height: "50vh" }} />
        </Space.Flex>
      </Space.Flex>
    </>
  );
});

HomeView.displayName = "HomeView";
export default HomeView;
