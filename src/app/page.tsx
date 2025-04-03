import noImage from '../../public/no-image.png';
import BlogLayout from "./components/blog_components/blogLayout";
import { Footer } from "./components/blog_components/footer";
import { Navbar } from "./components/blog_components/navbar";
import HomePage from "./components/blog_components/homePage";
import { setupAPIClient } from "../services/api";
import { Metadata, ResolvingMetadata } from "next";
import { SlideBannerClient } from './components/blog_components/slideBannerClient';
import { PublicationSidebarClient } from './components/blog_components/publicationSidebarClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {

  const fallbackMetadata: Metadata = {
    title: "Blog",
    description: "Veja o melhor conteudo na internet.",
    openGraph: {
      images: [{ url: noImage.src }]
    }
  };

  try {
    const apiClient = setupAPIClient();

    if (!API_URL || !BLOG_URL) {
      throw new Error('Variáveis de ambiente não configuradas!');
    }

    const response = await apiClient.get('/configuration_blog/get_configs');
    const { data } = await apiClient.get(`/seo/get_page?page=Pagina principal`);

    if (!data) {
      return fallbackMetadata;
    }

    const previousImages = (await parent).openGraph?.images || [];

    const ogImages = data?.ogImages?.map((image: string) => ({
      url: new URL(`/files/${image}`, API_URL).toString(),
      width: Number(data.ogImageWidth) || 1200,
      height: data.ogImageHeight || 630,
      alt: data.ogImageAlt || 'Blog',
    })) || [];

    const twitterImages = data?.twitterImages?.map((image: string) => ({
      url: new URL(`/files/${image}`, API_URL).toString(),
      width: Number(data.ogImageWidth) || 1200,
      height: data.ogImageHeight || 630,
      alt: data.ogImageAlt || 'Blog',
    })) || [];

    const faviconUrl = response.data.favicon
      ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
      : "./favicon.ico";

    return {
      title: data?.title || 'Nosso Blog',
      description: data?.description || 'Conheça nosso blog',
      metadataBase: new URL(BLOG_URL!),
      robots: {
        follow: true,
        index: true
      },
      icons: {
        icon: faviconUrl
      },
      openGraph: {
        title: data?.ogTitle || 'Nosso Blog',
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
        title: data?.twitterTitle || 'Nosso Blog',
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

export default async function Home_page() {

  return (
    <BlogLayout
      navbar={<Navbar />}
      bannersSlide={<SlideBannerClient position="SLIDER" local='Pagina_inicial' local_site='Pagina_inicial' />}
      footer={<Footer />}
      local='Pagina_inicial'
      sidebar_publication={<PublicationSidebarClient local='Pagina_inicial' />}
    >
      <HomePage />
    </BlogLayout>
  );
}