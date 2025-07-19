"use client";

import React from "react";

import { Button, Flex, LayoutStyle, Modal, Typography } from "@/client/ui/components";
import { useHandler } from "@/client/ui/hooks";

const ArticleActionsButtons = React.memo<{
  handleCreateChapter: VoidFunction;
}>(({ handleCreateChapter }) => {
  const deleteModalHandler = useHandler();

  return (
    <>
      <Flex column style={{ position: "fixed", top: LayoutStyle.Header.height, right: 0, padding: "8px" }}>
        <Button icon="hugeicons:add-01" onClick={handleCreateChapter} />
        <Button icon="hugeicons:edit-01" onClick={() => {}} />
        <Button icon="hugeicons:delete-02" color="error" onClick={deleteModalHandler.open} />
      </Flex>

      <Modal isOpen={deleteModalHandler.isOpen} onClose={deleteModalHandler.close} maskClosable={false}>
        <Typography.Title level="h6" text="Are you sure to delete this article ?" />
        <Typography.Paragraph text="This action cannot be undone !" color="secondary" style={{ margin: "16px 0px 32px" }} />
        <Flex row style={{ justifyContent: "flex-end" }}>
          <Button text="Cancel" variant="outline" onClick={deleteModalHandler.close} />
          <Button text="Delete" color="error" onClick={deleteModalHandler.close} />
        </Flex>
      </Modal>
    </>
  );
});

ArticleActionsButtons.displayName = "ArticleActionsButtons";
export default ArticleActionsButtons;
