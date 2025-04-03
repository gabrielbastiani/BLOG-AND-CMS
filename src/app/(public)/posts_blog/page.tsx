import { Suspense } from 'react';
import { setupAPIClient } from "@/services/api";
import { Metadata, ResolvingMetadata } from "next";
import ClientWrapper from "./ClientWrapper";
import BlogLayout from '@/app/components/blog_components/blogLayout';
import { Navbar } from '@/app/components/blog_components/navbar';
import { Footer } from '@/app/components/blog_components/footer';
import MarketingPopup from '@/app/components/blog_components/popups/marketingPopup';
import { SlideBannerClient } from '@/app/components/blog_components/slideBannerClient';
import { PublicationSidebarClient } from '@/app/components/blog_components/publicationSidebarClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {

    const fallbackMetadata: Metadata = {
        title: "Todos os artigos",
        description: "Veja todos os nossos artigos",
        openGraph: {
            images: [{ url: '../../../assets/no-image-icon-6.png' }]
        }
    };

    try {
        const apiClient = setupAPIClient();

        if (!API_URL || !BLOG_URL) {
            console.error('Variáveis de ambiente não configuradas');
            return fallbackMetadata;
        }

        const response = await apiClient.get('/configuration_blog/get_configs');
        const { data } = await apiClient.get(`/seo/get_page?page=Todos os artigos`);

        if (!data) {
            return fallbackMetadata;
        }

        const previousImages = (await parent).openGraph?.images || [];

        const ogImages = data?.ogImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Todos os artigos do blog',
        })) || [];

        const twitterImages = data?.twitterImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Todos os artigos do blog',
        })) || [];

        const faviconUrl = response.data.favicon
            ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
            : "../app/favicon.ico";

        return {
            title: data?.title || 'Todos os artigos do blog',
            description: data?.description || 'Conheça os artigos do nosso blog',
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: faviconUrl
            },
            openGraph: {
                title: data?.ogTitle || 'Todos os artigos do blog',
                description: data?.ogDescription || 'Conheça os artigos do nosso blog...',
                images: [
                    ...ogImages,
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: response.data.name_blog || 'Todos os artigos do blog',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data?.twitterTitle || 'Todos os artigos do blog',
                description: data?.twitterDescription || 'Conheça os artigos do nosso blog...',
                images: [
                    ...twitterImages,
                    ...previousImages,
                ],
                creator: data?.twitterCreator || '@perfil_twitter',
            },
            keywords: data?.keywords || [],
        };
    } catch (error) {
        console.error('Erro ao gerar metadados:', error);
        return fallbackMetadata;
    }
}

async function getData() {
    const apiClient = setupAPIClient();
    try {
        const [postsResponse] = await Promise.all([
            apiClient.get(`/post/articles/blog`),
        ]);

        return {
            all_posts: postsResponse.data.posts,
            totalPages: postsResponse.data.totalPages
        };
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return {
            all_posts: [],
            totalPages: 1
        };
    }
}

export default async function Posts_blog() {

    const { all_posts, totalPages } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={<SlideBannerClient position="SLIDER" local="Pagina_todos_artigos" local_site="Pagina_todos_artigos" />}
            footer={<Footer />}
            sidebar_publication={<PublicationSidebarClient local="Pagina_todos_artigos" />}
            local="Pagina_todos_artigos"
            presentation={
                <section className="bg-gray-800 py-12 text-[#FFFFFF] text-center">
                    <h1 className="text-3xl font-bold">Todos os artigos</h1>
                    <p className="text-gray-300 mt-2">
                        Explore todos os artigos do blog.
                    </p>
                </section>
            }
        >
            <Suspense fallback={<div>Carregando...</div>}>
                <ClientWrapper
                    all_posts={all_posts}
                    totalPages={totalPages}
                />
            </Suspense>
            <MarketingPopup position="POPUP" local="Pagina_todos_artigos" />
        </BlogLayout>
    );
}