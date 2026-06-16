import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Shivshakti Elevator Components Pvt. Ltd. | Touch The Sky",
  description: "Manufacturer of premium elevator cabins, automatic doors, car frames and elevator components. Headquartered in Surat, Gujarat with branches in Indore and Lucknow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.className} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

