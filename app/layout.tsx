import type { Metadata, Viewport } from "next";
import { Kanit, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const heading = Kanit({
  variable: "--font-heading",
  subsets: ["thai", "latin"],
  weight: ["500", "700", "800"],
});

const body = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

const title = "REAL GYM | ฟิตเนส Open Air ที่ใหญ่ที่สุด ทดลองเล่นฟรี";
const description =
  "ฟิตเนส Open Air ขนาดใหญ่ 7 สาขาในกรุงเทพฯ เครื่องเล่นกว่า 100 เครื่อง คลาสกว่า 200 คลาสต่อเดือน จองคลาสง่าย ๆ ผ่าน LINE ทดลองเล่นฟรี 3 วัน";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "REAL GYM",
    locale: "th_TH",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#121110",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${heading.variable} ${body.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
