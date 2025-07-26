"use client";

import React from "react";
import { Progress, Space, Typography } from "venomous-ui-react/components";

import { useGetUserByEmail } from "@/client/hooks/use-request-account";
import { Layout } from "@/client/ui/layout";

const AccountView = React.memo(() => {
  const { data, isLoading } = useGetUserByEmail();

  if (isLoading) {
    return (
      <Layout.Result>
        <Progress.LoadingBar />
      </Layout.Result>
    );
  }

  return (
    <Space.Flex column gap={4}>
      {data?.name && (
        <Space.Flex row>
          <Typography.Text text="Name: " />
          <Typography.Text text={data.name} />
        </Space.Flex>
      )}

      {data?.email && (
        <Space.Flex row>
          <Typography.Text text="Email: " />
          <Typography.Text text={data.email} />
        </Space.Flex>
      )}

      {data?.type && (
        <Space.Flex row>
          <Typography.Text text="Type: " />
          <Typography.Text text={data.type} />
        </Space.Flex>
      )}

      {data?.createdAt && (
        <Space.Flex row>
          <Typography.Text text="Created At: " />
          <Typography.Text text={data.createdAt.toString()} />
        </Space.Flex>
      )}

      {data?.updatedAt && (
        <Space.Flex row>
          <Typography.Text text="Updated At: " />
          <Typography.Text text={data.updatedAt.toString()} />
        </Space.Flex>
      )}
    </Space.Flex>
  );
});

AccountView.displayName = "AccountView";
export default AccountView;
