"use client"

import { useTheme } from "@/contexts/ThemeContext";
import { setupAPIClient } from "@/services/api";
import { ReactNode, useEffect, useState } from "react";

interface BlogLayoutProps {
    navbar: ReactNode;
    footer: ReactNode;
    children: ReactNode;
    sidebar_publication?: ReactNode;
    bannersSlide?: ReactNode;
    presentation?: ReactNode;
    local: string;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ navbar, footer, children, sidebar_publication, bannersSlide, presentation, local }) => {

    const { colors } = useTheme();
    
    const [showMobileBanners, setShowMobileBanners] = useState(true);
    const [sidebar, setSidebar] = useState(0);

    useEffect(() => {
        async function fetchSidebar() {
            const apiClient = setupAPIClient();
            try {
                const { data } = await apiClient.get(`/marketing_publication/existing_sidebar?local=${local}`)

                setSidebar(data.length);

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchSidebar();
        const interval = setInterval(fetchSidebar, 10000);
        return () => clearInterval(interval);
    }, []);

    const hasSidebarPublication = sidebar > 0;

    return (
        <div
            className="flex flex-col min-h-screen"
            style={{ background: colors?.thirdbackgroundColor || '#f3f4f6' }}
        >
            {/* Navbar */}
            {navbar}
            {/* Banners */}
            <div className="w-full bg-gray-200 overflow-hidden">
                {bannersSlide}
            </div>

            {presentation}

            <main className="flex-1 flex">
                {/* Main Content */}
                <div
                    className="w-full flex-1 p-4 rounded shadow"
                    style={{ background: colors?.thirdbackgroundColor || '#f3f4f6' }}
                >
                    {children}
                </div>
                {/* Aside (Fixed Scroll) */}
                {sidebar >= 1 ? (
                    <aside
                        className="hidden lg:block sticky top-28 h-screen w-[300px p-4 shadow"
                        style={{ background: colors?.secondarybackgroundColor || '#f3f4f6' }}
                    >
                        <div className="overflow-y-auto h-full">
                            {/* Conteúdo do Aside */}
                            {sidebar_publication}
                        </div>
                    </aside>
                ) : null}
            </main>
            {/* Banners - Mobile */}
            {hasSidebarPublication && showMobileBanners && (
                <div
                    className="fixed bottom-0 left-0 w-full border-t shadow-lg lg:hidden z-20"
                    style={{ background: colors?.secondarybackgroundColor || '#abaeb4' }}
                >
                    <div className="flex items-center justify-between p-4">
                        <span
                            className="font-medium"
                            style={{ color: colors?.secondaryColor || '#abaeb4' }}
                        >Aproveite!!!</span>
                        <button
                            onClick={() => setShowMobileBanners(false)}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                            style={{ color: colors?.secondaryColor || '#abaeb4' }}
                        >
                            ✕ Fechar
                        </button>
                    </div>
                    <div className="flex overflow-x-auto gap-4 p-4">
                        {Array.isArray(sidebar_publication)
                            ? sidebar_publication.map((banner, index) => (
                                <div key={index} className="min-w-[70%] flex-shrink-0">
                                    {banner}
                                </div>
                            ))
                            : sidebar_publication}
                    </div>
                </div>
            )}
            {/* Footer */}
            {footer}
        </div>
    );
};

export default BlogLayout;