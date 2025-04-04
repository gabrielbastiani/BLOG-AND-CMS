export const dynamic = 'force-dynamic';
import { setupAPIClient } from "@/services/api";
import { Footer } from "../../components/blog_components/footer";
import { Navbar } from "../../components/blog_components/navbar";
import Link from "next/link";
import BlogLayout from "../../components/blog_components/blogLayout";
import MarketingPopup from "../../components/blog_components/popups/marketingPopup";
import { Metadata, ResolvingMetadata } from "next";
import { SlideBannerClient } from "@/app/components/blog_components/slideBannerClient";
import { PublicationSidebarClient } from "@/app/components/blog_components/publicationSidebarClient";
import SectionTitlePage from "@/app/components/blog_components/blogLayout/sectionTitlePage";
import ClientWrapperCategs from "./ClientWrapperCategs";

interface Category {
    id: string;
    slug_name_category: string;
    name_category: string;
    description: string;
    image_category: string;
    children: {
        id: string;
        slug_name_category: string;
        name_category: string;
    }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {

    const fallbackMetadata: Metadata = {
        title: "Categorias",
        description: "Todas as categorias",
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
        const { data } = await apiClient.get(`/seo/get_page?page=Todas as categorias`);

        if (!data) {
            return fallbackMetadata;
        }

        const previousImages = (await parent).openGraph?.images || [];

        const ogImages = data?.ogImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Todas as categorias do blog',
        })) || [];

        const twitterImages = data?.twitterImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Todas as categorias do blog',
        })) || [];

        const faviconUrl = response.data.favicon
            ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
            : "../../favicon.ico";

        return {
            title: data?.title || 'Todas as categorias do blog',
            description: data?.description || 'Conheça as categorias do nosso blog',
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: faviconUrl
            },
            openGraph: {
                title: data?.ogTitle || 'Todas as categorias do blog',
                description: data?.ogDescription || 'Conheça os artigos do nosso blog...',
                images: [
                    ...ogImages,
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: response.data.name_blog || 'Todas as categorias do blog',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data?.twitterTitle || 'Todas as categorias do blog',
                description: data?.twitterDescription || 'Categorias do nosso blog...',
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
        const [categoriesResponse] = await Promise.all([
            apiClient.get<Category[]>("/categories/blog/posts")
        ]);

        return {
            categories: categoriesResponse.data
        };
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return {
            categories: []
        };
    }
}

export default async function Posts_categories() {

    const { categories } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={<SlideBannerClient position="SLIDER" local="Pagina_todas_categorias" local_site="Pagina_todas_categorias" />}
            footer={<Footer />}
            sidebar_publication={<PublicationSidebarClient local="Pagina_todas_categorias" />}
            local="Pagina_todas_categorias"
            presentation={<SectionTitlePage title='Todas as categorias' description='Explore todas as categorias do blog.' />}
        >
            <ClientWrapperCategs categories={categories} />
            <MarketingPopup position="POPUP" local="Pagina_todas_categorias" />
        </BlogLayout>
    );
}

<script type="application/ld+json">
    {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Categorias",
            "item": BLOG_URL + "/posts_categories"
        }]
    })}
</script>