"use client";

import Link from "next/link";
import React from "react";
import { Button, Space, Typography } from "venomous-ui-react/components";

import { Layout } from "@/client/ui";

const NotfoundView = React.memo(() => {
  return (
    <Layout.Result>
      <Space.Flex column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Typography.Title text="404 Not Found" as="h2" style={{ textAlign: "center" }} />

        <Typography.Title text="The page you are looking for does not exist." as="h5" style={{ textAlign: "center", padding: "16px 0 40px" }} />

        <Link href="/" replace>
          <Button text="Back to Home" />
        </Link>
      </Space.Flex>
    </Layout.Result>
  );
});

NotfoundView.displayName = "NotfoundView";
export default NotfoundView;
