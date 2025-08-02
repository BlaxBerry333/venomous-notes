"use client";

import Link from "next/link";
import React from "react";
import { Cards, Space } from "venomous-ui-react/components";

import type { IArticle } from "@/types/articles";

const ArticlesCardStyle = {
  height: 270,
  width: 170,
  space: 6,
} as const;

const ArticlesGridCards = React.memo<{ data: IArticle[] }>(({ data }) => {
  return (
    <Space.Grid
      columns={{
        xs: 2,
        sm: 3,
        md: 4,
        lg: 6,
        xl: 6,
      }}
      spacing={0}
      style={{ padding: "8px" }}
    >
      {data.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}?chapterOrder=1`}
          scroll
          style={{
            width: "100%",
            height: "max-content",
            padding: ArticlesCardStyle.space,
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Cards.Book height={ArticlesCardStyle.height} width={ArticlesCardStyle.width} coverImage={article.imgUrl} title={article.title}>
            {/* 毛玻璃遮罩层 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(2px) brightness(0.6)",
                WebkitBackdropFilter: "blur(2px) brightness(0.6)",
              }}
            />
          </Cards.Book>
        </Link>
      ))}
    </Space.Grid>
  );
});

ArticlesGridCards.displayName = "ArticlesGridCards";
export default ArticlesGridCards;
