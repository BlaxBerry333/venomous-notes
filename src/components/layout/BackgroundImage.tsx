"use client";

import { memo, type NamedExoticComponent } from "react";
import { LazyImage } from "venomous-ui";

const BackgroundImage: NamedExoticComponent = memo(() => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <LazyImage
        src="/static/backgrounds/01.avif"
        alt="background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
});

BackgroundImage.displayName = "BackgroundImage";
export default BackgroundImage;
