import { Outfit } from "next/font/google";
import "./globals.css";
import PageTransitionProvider from "@/components/layout/PageTransitionProvider";
import RopeElevator from "@/components/sections/RopeElevator";

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
      <body suppressHydrationWarning>
        <PageTransitionProvider>
          <RopeElevator />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}

