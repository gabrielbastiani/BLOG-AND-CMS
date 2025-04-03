import { Footer } from "../../components/blog_components/footer";
import { Navbar } from "../../components/blog_components/navbar";
import BlogLayout from "../../components/blog_components/blogLayout";
import MarketingPopup from "../../components/blog_components/popups/marketingPopup";
import { setupAPIClient } from "@/services/api";
import { Metadata, ResolvingMetadata } from "next";
import { SlideBannerClient } from "@/app/components/blog_components/slideBannerClient";
import { PublicationSidebarClient } from "@/app/components/blog_components/publicationSidebarClient";
import DynamicConfigsPagePoliticasPrivacidade from "@/app/components/blog_components/dinamics_configs_blog/dynamicConfigsPagePoliticasPrivacidade";

const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata(
    parent: ResolvingMetadata
): Promise<Metadata> {

    const fallbackMetadata: Metadata = {
        title: "Politicas de privacidade",
        description: "Conheça nossas politicas de privacidade",
        openGraph: {
            images: [{ url: '../../assets/no-image-icon-6.png' }]
        }
    };

    try {
        const apiClient = setupAPIClient();

        if (!API_URL || !BLOG_URL) {
            console.error('Variáveis de ambiente não configuradas');
            return fallbackMetadata;
        }

        const response = await apiClient.get('/configuration_blog/get_configs');
        const { data } = await apiClient.get(`/seo/get_page?page=Politicas de privacidade`);

        if (!data) {
            return fallbackMetadata;
        }

        const previousImages = (await parent).openGraph?.images || [];

        const ogImages = data?.ogImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Politicas de privacidade',
        })) || [];

        const twitterImages = data?.twitterImages?.map((image: string) => ({
            url: new URL(`/files/${image}`, API_URL).toString(),
            width: Number(data.ogImageWidth) || 1200,
            height: data.ogImageHeight || 630,
            alt: data.ogImageAlt || 'Politicas de privacidade',
        })) || [];

        const faviconUrl = response.data.favicon
            ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
            : "../../favicon.ico";

        return {
            title: data?.title || 'Politicas de privacidade - Blog',
            description: data?.description || 'Conheça nossas politicas de privacidade',
            metadataBase: new URL(BLOG_URL!),
            robots: {
                follow: true,
                index: true
            },
            icons: {
                icon: faviconUrl
            },
            openGraph: {
                title: data?.ogTitle || 'Politicas de privacidade - Blog',
                description: data?.ogDescription || 'Conheça nossas politicas de privacidade...',
                images: [
                    ...ogImages,
                    ...previousImages,
                ],
                locale: 'pt_BR',
                siteName: response.data.name_blog || 'nossas politicas de privacidade',
                type: "website"
            },
            twitter: {
                card: 'summary_large_image',
                title: data?.twitterTitle || 'Politicas de privacidade - Blog',
                description: data?.twitterDescription || 'Conheça nossas politicas de privacidade...',
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
        const response = await apiClient.get('/configuration_blog/get_configs');
        console.log('Dados do servidor:', response.data);
        return { configs: response.data };
    } catch (error) {
        console.error("Erro SSR:", error);
        return { configs: null };
    }
}

export default async function Politicas_de_privacidade() {

    const { configs } = await getData();

    return (
        <BlogLayout
            navbar={<Navbar />}
            bannersSlide={<SlideBannerClient position="SLIDER" local="Pagina_politicas_de_privacidade" local_site="Pagina_politicas_de_privacidade" />}
            sidebar_publication={<PublicationSidebarClient local="Pagina_politicas_de_privacidade" />}
            local="Pagina_politicas_de_privacidade"
            footer={<Footer />}
        >
            <DynamicConfigsPagePoliticasPrivacidade initialConfigs={configs} />
            
            <MarketingPopup
                position="POPUP"
                local="Pagina_politicas_de_privacidade"
            />
        </BlogLayout>
    );
}