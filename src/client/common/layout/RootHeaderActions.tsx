"use client";

import { memo, type NamedExoticComponent } from "react";
import {
  Avatar,
  Button,
  Drawer,
  DrawerHeader,
  Flex,
  useDrawer,
  useThemeBreakpoint,
} from "venomous-ui";

const RootHeaderActions: NamedExoticComponent = memo(() => {
  const themeBreakpoint = useThemeBreakpoint();

  const themeSettingDrawerHandler = useDrawer();

  return (
    <Flex row sx={{ flex: 1, justifyContent: "flex-end" }}>
      <Avatar src="https://avatars.githubusercontent.com/u/166675080?v=4" alt="avatar" width={40} />
      <Button icon="solar:settings-bold-duotone" isCircle isGhost iconWidth={24} />

      {themeBreakpoint.isXs && (
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
            <DrawerHeader title="Navigation" closeDrawer={themeSettingDrawerHandler.closeDrawer} />
            <div style={{ height: "100vh", backgroundColor: "pink" }} />
            <div style={{ height: "100vh", backgroundColor: "red" }} />
          </Drawer>
        </>
      )}
    </Flex>
  );
});

RootHeaderActions.displayName = "RootHeaderActions";
export default RootHeaderActions;
