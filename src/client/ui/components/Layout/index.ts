import LayoutBackground from "./LayoutBackground";
import LayoutHeader from "./LayoutHeader";
import LayoutMain from "./LayoutMain";
import LayoutProvider from "./LayoutProvider";
import LayoutResult from "./LayoutResult";
import LayoutSidenav from "./LayoutSidenav";

export { LayoutStyle } from "./index.styles";

export type { LayoutContextType } from "./index.types";

export const Layout = {
  Provider: LayoutProvider,
  Header: LayoutHeader,
  Sidenav: LayoutSidenav,
  Main: LayoutMain,
  Result: LayoutResult,
  Background: LayoutBackground,
};
