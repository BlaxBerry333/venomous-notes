"use client";

import React, { useCallback } from "react";
import { Button, notify } from "venomous-ui-react/components";

import { useCreateUser } from "@/client/hooks/use-request-account";
import { EUserType } from "@/types/account";

const LoginView = React.memo(() => {
  const createUserMutation = useCreateUser({
    onSuccess: () => notify({ type: "success", title: "Success create user" }),
    onError: (message) => notify({ type: "error", title: message }),
  });

  const handleCreateUser = useCallback(() => {
    createUserMutation.mutateAsync({
      name: "admin",
      email: "admin@example.com",
      password: "admin",
      type: EUserType.Normal,
    });
  }, [createUserMutation]);

  return (
    <>
      <Button variant="contained" onClick={handleCreateUser} isLoading={createUserMutation.isPending} text="create user" />
    </>
  );
});

LoginView.displayName = "LoginView";
export default LoginView;
