"use client";

import React from "react";
import { Button, Buttons, Modal, Space, Typography } from "venomous-ui-react/components";
import { useHandler } from "venomous-ui-react/hooks";

import { LayoutStyle } from "@/client/ui/layout";

const ArticleActionsButtons = React.memo<{
  handleCreateChapter: VoidFunction;
}>(({ handleCreateChapter }) => {
  const deleteModalHandler = useHandler();

  return (
    <>
      <Space.Flex column style={{ position: "fixed", top: LayoutStyle.Header.height, right: 0, padding: "8px", zIndex: 100, width: "auto" }}>
        <Buttons.Icon icon="hugeicons:add-01" variant="ghost" onClick={handleCreateChapter} />
        <Buttons.Icon icon="hugeicons:edit-01" variant="ghost" onClick={() => {}} />
        <Buttons.Icon icon="hugeicons:delete-02" variant="ghost" color="error" onClick={deleteModalHandler.open} />
      </Space.Flex>

      <Modal isOpen={deleteModalHandler.isOpen} onClose={deleteModalHandler.close} maskClosable={false}>
        <Typography.Title as="h6" text="Are you sure to delete this article ?" />
        <Typography.Paragraph style={{ margin: "16px 0px 32px" }}>This action cannot be undone !</Typography.Paragraph>
        <Space.Flex row style={{ justifyContent: "flex-end" }}>
          <Button text="Cancel" variant="outline" onClick={deleteModalHandler.close} />
          <Button text="Delete" color="error" onClick={deleteModalHandler.close} />
        </Space.Flex>
      </Modal>
    </>
  );
});

ArticleActionsButtons.displayName = "ArticleActionsButtons";
export default ArticleActionsButtons;
