import { Footer } from "../../components/blog_components/footer";
import { Navbar } from "../../components/blog_components/navbar";
import BlogLayout from "../../components/blog_components/blogLayout";
import MarketingPopup from "../../components/blog_components/popups/marketingPopup";
import { setupAPIClient } from "@/services/api";
import { Metadata, ResolvingMetadata } from "next";
import { SlideBannerClient } from "@/app/components/blog_components/slideBannerClient";
import { PublicationSidebarClient } from "@/app/components/blog_components/publicationSidebarClient";
import DynamicConfigsPageAbout from "@/app/components/blog_components/dinamics_configs_blog/dynamicConfigsPageAbout";

const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata(
  props: {},
  parent: ResolvingMetadata
): Promise<Metadata> {

  const fallbackMetadata: Metadata = {
    title: "Sobre Nós",
    description: "Conheça mais sobre nosso blog",
    openGraph: {
      images: [{
        url: new URL('../../../assets/no-image-icon-6.png', BLOG_URL).toString()
      }]
    }
  };

  try {
    const apiClient = setupAPIClient();

    if (!API_URL || !BLOG_URL) {
      console.error('Variáveis de ambiente não configuradas');
      return fallbackMetadata;
    }

    const response = await apiClient.get('/configuration_blog/get_configs');
    const { data } = await apiClient.get(`/seo/get_page?page=Sobre`);

    if (!data) {
      return fallbackMetadata;
    }

    const previousParent = await parent;
    const previousImages = previousParent.openGraph?.images || [];

    const ogImages = data?.ogImages?.map((image: string) => ({
      url: new URL(`/files/${image}`, API_URL).toString(),
      width: Number(data.ogImageWidth) || 1200,
      height: data.ogImageHeight || 630,
      alt: data.ogImageAlt || 'Sobre',
    })) || [];

    const twitterImages = data?.twitterImages?.map((image: string) => ({
      url: new URL(`/files/${image}`, API_URL).toString(),
      width: Number(data.ogImageWidth) || 1200,
      height: data.ogImageHeight || 630,
      alt: data.ogImageAlt || 'Sobre',
    })) || [];

    const faviconUrl = response.data.favicon
      ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
      : new URL('../../favicon.ico', BLOG_URL).toString();

    return {
      title: data?.title || 'Sobre - Nosso Blog',
      description: data?.description || 'Conheça nosso blog',
      metadataBase: new URL(BLOG_URL),
      robots: {
        follow: true,
        index: true
      },
      icons: {
        icon: faviconUrl
      },
      openGraph: {
        title: data?.ogTitle || 'Sobre - Nosso Blog',
        description: data?.ogDescription || 'Conheça nosso blog...',
        images: [
          ...ogImages,
          ...previousImages,
        ],
        locale: 'pt_BR',
        siteName: response.data.name_blog || 'Nosso Blog',
        type: "website"
      },
      twitter: {
        card: 'summary_large_image',
        title: data?.twitterTitle || 'Sobre - Nosso Blog',
        description: data?.twitterDescription || 'Conheça nosso blog...',
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

export default async function About() {

  const { configs } = await getData();

  return (
    <BlogLayout
      navbar={<Navbar />}
      bannersSlide={<SlideBannerClient position="SLIDER" local="Pagina_sobre" local_site="Pagina_sobre" />}
      sidebar_publication={<PublicationSidebarClient local="Pagina_sobre" />}
      local="Pagina_sobre"
      footer={<Footer />}
    >

      <DynamicConfigsPageAbout initialConfigs={configs} />

      <MarketingPopup
        position="POPUP"
        local="Pagina_sobre"
      />
    </BlogLayout>
  );
}