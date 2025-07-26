"use client";

import Link from "next/link";
import React from "react";
import { Cards, Space } from "venomous-ui-react/components";

import type { IArticle } from "@/types/articles";

const ArticleCardStyle = {
  height: 360,
  width: 260,
  margin: 8,
} as const;

const ArticlesGridCards = React.memo<{ data: IArticle[] }>(({ data }) => {
  return (
    <Space.Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}>
      {data.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}?chapterOrder=1`}
          scroll
          style={{
            margin: ArticleCardStyle.margin,
            width: "100%",
            height: "max-content",
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Cards.Book height={ArticleCardStyle.height} width={ArticleCardStyle.width} coverImage={article.imgUrl} title={article.title}>
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
