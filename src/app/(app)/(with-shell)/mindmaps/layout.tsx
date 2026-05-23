/** /mindmaps/* 公共布局——max-width 壳；标题区由 page 自渲染（与 mindmap 元数据绑定）；「+ 新建」入口在 Sidebar */
export default function MindmapsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-12 py-6 max-md:px-5 max-md:pt-6 max-md:pb-8">
      {children}
    </div>
  )
}
