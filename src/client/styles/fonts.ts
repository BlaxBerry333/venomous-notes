// cSpell:disable
import { Alkatra, Ma_Shan_Zheng, New_Tegomin } from "next/font/google";

// latin
const alkatra = Alkatra({
  variable: "--font-alkatra",
  subsets: ["latin"],
  weight: "400",
});

// chinese
const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan-zheng",
  subsets: ["latin"],
  weight: "400",
});

// japanese
const newTegomin = New_Tegomin({
  variable: "--font-new-tegomin",
  subsets: ["latin"],
  weight: "400",
});

const Fonts = {
  alkatra,
  maShanZheng,
  newTegomin,
};

export default Fonts;

export const GlobalFontFamily = `
  ${Fonts.alkatra.style.fontFamily}, 
  ${Fonts.maShanZheng.style.fontFamily}, 
  ${Fonts.newTegomin.style.fontFamily}
`;
