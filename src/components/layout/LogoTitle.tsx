"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, type NamedExoticComponent } from "react";

import { Flex, Text, useThemeBreakpoint } from "venomous-ui";

const LogoTitle: NamedExoticComponent = memo(() => {
  const themeBreakpoint = useThemeBreakpoint();

  return (
    <Link href="/" scroll>
      <Flex row gap={0}>
        <Image width={40} height={40} src="/logo.svg" alt="Logo" draggable={false} priority />

        {!themeBreakpoint.isXs && (
          <Text
            isTitle
            titleLevel="h4"
            text={"Notes".slice(1)}
            sx={{ transform: "translateY(6px)" }}
          />
        )}
      </Flex>
    </Link>
  );
});

LogoTitle.displayName = "LogoTitle";
export default LogoTitle;
