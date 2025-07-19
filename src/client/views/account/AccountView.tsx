"use client";

import React from "react";

import { useGetUserByEmail } from "@/client/hooks/use-request-account";
import { Flex, Layout, Loading, Typography } from "@/client/ui/components";

const AccountView = React.memo(() => {
  const { data, isLoading } = useGetUserByEmail();

  if (isLoading) {
    return (
      <Layout.Result>
        <Loading />
      </Layout.Result>
    );
  }

  return (
    <Flex column gap={4}>
      {data?.name && (
        <Flex row>
          <Typography.Text text="Name: " />
          <Typography.Text text={data.name} />
        </Flex>
      )}

      {data?.email && (
        <Flex row>
          <Typography.Text text="Email: " />
          <Typography.Text text={data.email} />
        </Flex>
      )}

      {data?.type && (
        <Flex row>
          <Typography.Text text="Type: " />
          <Typography.Text text={data.type} />
        </Flex>
      )}

      {data?.createdAt && (
        <Flex row>
          <Typography.Text text="Created At: " />
          <Typography.Text text={data.createdAt.toString()} />
        </Flex>
      )}

      {data?.updatedAt && (
        <Flex row>
          <Typography.Text text="Updated At: " />
          <Typography.Text text={data.updatedAt.toString()} />
        </Flex>
      )}
    </Flex>
  );
});

AccountView.displayName = "AccountView";
export default AccountView;
