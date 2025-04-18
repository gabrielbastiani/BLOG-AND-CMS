import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProviderBlog } from "@/contexts/AuthContextBlog";
import { PrivacyProvider } from "@/contexts/PrivacyContext";
import PrivacyBanner from "./components/blog_components/police_privacy/privacyBanner";
import PrivacySettingsModal from "./components/blog_components/police_privacy/privacySettingsModal";
import { ThemeProvider } from "@/contexts/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG || 'http://localhost:3000';

const geistSans = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  let blog = null;

  try {
    const response = await fetch(`${API_URL}/configuration_blog/get_configs`, {
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    blog = await response.json();
  } catch (error) {
    console.error("Error fetching blog configuration:", error);
  }

  const defaultMetadata = {
    title: "Blog",
    description: "Descrição do blog",
    favicon: "./favicon.ico",
  };

  const faviconUrl = blog?.favicon
    ? new URL(`/files/${blog.favicon}`, API_URL).toString()
    : defaultMetadata.favicon;

  return {
    metadataBase: new URL(BLOG_URL),
    title: blog?.name_blog || defaultMetadata.title,
    description: blog?.description_blog || defaultMetadata.description,
    icons: {
      icon: faviconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body id="root" className={`${geistSans.variable} antialiased`}>
        <ThemeProvider>
          <PrivacyProvider>
            <AuthProvider>
              <AuthProviderBlog>
                <ToastContainer autoClose={5000} />
                {children}
              </AuthProviderBlog>
            </AuthProvider>
            <PrivacyBanner />
            <PrivacySettingsModal />
          </PrivacyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}