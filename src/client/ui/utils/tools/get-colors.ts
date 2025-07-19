/**
 * 将 hex 转换为标准 6 位格式
 */
function normalizeHex(hex: string): string {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${hex}`;
}

/**
 * hex -> {r, g, b}
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

/**
 * {r, g, b} -> hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const h = n.toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * 调整亮度
 * percent > 0 提亮
 * percent < 0 变暗
 */
function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (c: number) => Math.min(255, Math.max(0, Math.round(c + (percent / 100) * 255)));
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * 获取颜色
 * @param hex hex color
 */
export function getColors(hex: string): {
  origin: string;
  light: string;
  dark: string;
  opacity: string;
} {
  const normalized = normalizeHex(hex);
  const light = adjustBrightness(normalized, 25); // 提亮 25%
  const dark = adjustBrightness(normalized, -25); // 变暗 25%
  const { r, g, b } = hexToRgb(normalized);
  const opacity = `rgba(${r}, ${g}, ${b}, 0.5)`;
  return {
    origin: normalized,
    light,
    dark,
    opacity,
  };
}
