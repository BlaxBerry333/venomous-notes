"use client";

import { memo, type NamedExoticComponent } from "react";
import { Avatar, Button, Drawer, Flex, useDrawer, useThemeBreakpoint } from "venomous-ui";

export const SETTING_DRAWER_HEADER_KEY = "setting-drawer-header" as const;
export const SETTING_DRAWER_CONTENT_KEY = "setting-drawer-content" as const;

const RootHeaderActions: NamedExoticComponent = memo(() => {
  const themeBreakpoint = useThemeBreakpoint();
  const showDrawer = themeBreakpoint.isXs || themeBreakpoint.isSm || themeBreakpoint.isMd;

  const themeSettingDrawerHandler = useDrawer();

  return (
    <Flex row sx={{ flex: 1, justifyContent: "flex-end" }}>
      <Avatar src="https://avatars.githubusercontent.com/u/166675080?v=4" alt="avatar" width={40} />
      <Button icon="solar:settings-bold-duotone" isCircle isGhost iconWidth={24} />

      {showDrawer && (
        <>
          <Button
            icon="solar:hamburger-menu-broken"
            isCircle
            isGhost
            iconWidth={24}
            onClick={themeSettingDrawerHandler.openDrawer}
          />
          <Drawer
            width={300}
            position="right"
            isOpen={themeSettingDrawerHandler.isOpen}
            closeDrawer={themeSettingDrawerHandler.closeDrawer}
          >
            {/* React Portal Target */}
            <div id={SETTING_DRAWER_CONTENT_KEY} />
          </Drawer>
        </>
      )}
    </Flex>
  );
});

RootHeaderActions.displayName = "RootHeaderActions";
export default RootHeaderActions;
