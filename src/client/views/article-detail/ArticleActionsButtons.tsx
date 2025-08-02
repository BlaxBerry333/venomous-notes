"use client";

import React from "react";
import { Buttons, Modals, Space } from "venomous-ui-react/components";
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
        <Buttons.Icon icon="hugeicons:delete-02" variant="ghost" semanticColor="error" onClick={deleteModalHandler.open} />
      </Space.Flex>

      <Modals.Confirm
        isOpen={deleteModalHandler.isOpen}
        onClose={deleteModalHandler.close}
        maskClosable={false}
        title="Are you sure to delete this article ?"
        description="This action cannot be undone !"
        onCancel={deleteModalHandler.close}
        onConfirm={deleteModalHandler.close}
        cancelText="Cancel"
        confirmText="Delete"
      />
    </>
  );
});

ArticleActionsButtons.displayName = "ArticleActionsButtons";
export default ArticleActionsButtons;
