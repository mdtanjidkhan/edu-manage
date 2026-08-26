import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = { title: { default: "EduManage | School Management System", template: "%s | EduManage", },
 description: "EduManage is a modern school management system for managing students, teachers, attendance, exams, results, fees, routines, and academic activities.",
  keywords: [ "School Management System", "EduManage", "Student Management", "Teacher Management", "School ERP", "Education Management", ],
   authors: [{ name: "Tanjid Khan" }], };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
