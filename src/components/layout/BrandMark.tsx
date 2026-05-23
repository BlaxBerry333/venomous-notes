/* 品牌标识 · design-spec §5 —— 几何「墨滴」轮廓，翡翠绿描边 */
export function BrandMark() {
  return (
    <svg
      className="grid h-[30px] w-[30px] flex-shrink-0 place-items-center"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 3.5 C 9.5 13 6.5 17 6.5 20.8 A 8.5 8.5 0 0 0 23.5 20.8 C 23.5 17 20.5 13 15 3.5 Z"
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="20.5" r="3.1" fill="var(--accent)" />
    </svg>
  )
}
