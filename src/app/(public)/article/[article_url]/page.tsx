export const dynamic = 'force-dynamic'
import BlogLayout from "@/app/components/blog_components/blogLayout";
import { Footer } from "@/app/components/blog_components/footer";
import { Navbar } from "@/app/components/blog_components/navbar";
import { setupAPIClient } from "@/services/api";
import Image from "next/image";
import { FiClock } from "react-icons/fi";
import Link from 'next/link';
import { Newsletter } from '@/app/components/blog_components/newsletter';
import { CommentsSection } from '@/app/components/blog_components/commentsSection';
import Most_posts_views from '@/app/components/blog_components/most_posts_views';
import SocialShare from '@/app/components/blog_components/socialShare';
import BackToTopButton from '@/app/components/blog_components/backToTopButton';
import MarketingPopup from '@/app/components/blog_components/popups/marketingPopup';
import { SlideBanner } from '@/app/components/blog_components/slideBannerClient/slideBanner';
import { FaRegEye } from 'react-icons/fa';
import PublicationSidebar from '@/app/components/blog_components/publicationSidebarClient/publicationSidebar';
import { Metadata, ResolvingMetadata } from 'next';
import { PostsProps } from "../../../../../Types/types";
import ArticleLikeDislikeWrapper from "@/app/components/blog_components/articleLikeDeslike/articleLikeDeslikeWrapper";
import SafeHTML from "@/app/components/SafeHTML";
import ViewCounter from "@/app/components/blog_components/viewCounter";
import { PublicationSidebarClient } from "@/app/components/blog_components/publicationSidebarClient";
import { SlideBannerClient } from "@/app/components/blog_components/slideBannerClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BLOG_URL = process.env.NEXT_PUBLIC_URL_BLOG;

export async function generateMetadata(
  { params }: { params: { article_url: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const articleUrl = params.article_url; // Primeiro acesso ao params

    const apiClient = setupAPIClient();
    const [response, data, article] = await Promise.all([
      apiClient.get('/configuration_blog/get_configs'),
      apiClient.get(`/seo/get_page?page=Pagina principal`),
      apiClient.get<PostsProps>(`/post/article/content?url_post=${articleUrl}`),
    ]);

    const previousParent = await parent;
    const previousImages = previousParent.openGraph?.images || [];

    const cleanDescription = article.data.text_post
      ?.replace(/<[^>]*>/g, '')
      ?.substring(0, 160) || "Leia este artigo completo em nosso blog";

    const imageUrl = article.data.image_post
      ? new URL(`/files/${article.data.image_post}`, API_URL).toString()
      : new URL("../../../../assets/no-image-icon-6.png", BLOG_URL).toString();

    const faviconUrl = response.data.favicon
      ? new URL(`/files/${response.data.favicon}`, API_URL).toString()
      : "../../../favicon.ico";

    return {
      title: article.data.title || "Artigo",
      description: cleanDescription,
      metadataBase: new URL(BLOG_URL!),
      robots: { follow: true, index: true },
      icons: { icon: faviconUrl },
      openGraph: {
        title: article.data.title,
        description: cleanDescription,
        images: [
          { url: imageUrl, width: 1200, height: 630, alt: article.data.title },
          ...previousImages,
        ],
        type: 'article',
        publishedTime: new Date(article.data.publish_at || article.data.created_at).toISOString(),
        authors: [article.data.author || "Autor Desconhecido"],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.data.title || "Artigo",
        description: cleanDescription,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: article.data.title }],
        creator: data.data?.twitterCreator || '@perfil_twitter',
      },
      keywords: article.data.seo_keywords || [],
    };
  } catch (error) {
    return {
      title: "Artigo não encontrado",
      description: "O artigo que você está procurando não foi encontrado",
    };
  }
}

async function getData(articleUrl: string) {
  const apiClient = setupAPIClient();
  const [article] = await Promise.all([
    apiClient.get<PostsProps>(`/post/article/content?url_post=${articleUrl}`)
  ]);

  return {
    article_data: article.data,
  };
}

interface ArticlePageProps {
  params: { article_url: string };
}

export default async function Article({ params }: ArticlePageProps) {

  const articleUrl = params.article_url;

  const { article_data } = await getData(articleUrl);

  const calculateReadingTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} min de leitura`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace(".0", "")} Mi`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1).replace(".0", "")} Mil`;
    return views.toString();
  };

  return (
    <BlogLayout
      navbar={<Navbar />}
      footer={<Footer />}
      sidebar_publication={<PublicationSidebarClient local="Pagina_artigo" />}
      local="Pagina_artigo"
      bannersSlide={
        <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden">
          {article_data?.id && <ViewCounter postId={article_data.id} />}
          {article_data?.image_post ? (
            <Image
              src={`${API_URL}/files/${article_data.image_post}`}
              alt={article_data.title || "Imagem do artigo"}
              className="object-fill w-full h-full"
              width={1200}
              height={800}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Sem imagem disponível
            </div>
          )}
        </div>
      }
    >
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{article_data?.title}</h1>
        <span className='text-gray-600'>Autor: {article_data?.author || "Desconhecido"}</span>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-12 mt-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-lg" />
            <span>
              {new Date(article_data?.publish_at || article_data?.created_at || new Date()).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegEye className="text-lg" />
            <span>{formatViews(article_data?.views || 0)}</span>
          </div>
          {article_data?.text_post && (
            <div className="text-sm">
              {calculateReadingTime(article_data.text_post)}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {article_data?.categories?.map((cat) => (
              <Link key={cat.category?.id} href={`/posts_categories/${cat?.category?.slug_name_category}`}>
                <span
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cat.category?.name_category}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="prose max-w-none text-gray-800 prose-h1:text-blue-600 prose-p:mb-4 prose-a:text-indigo-500 hover:prose-a:underline">
          {article_data?.text_post && <SafeHTML html={article_data.text_post} />}
        </div>

        {article_data?.tags && article_data?.tags.length > 0 && (
          <div className="mt-10 mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tags:</h2>
            <div className="flex flex-wrap gap-2">
              {article_data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag.tag?.tag_name}
                </span>
              ))}
            </div>
          </div>
        )}

        <ArticleLikeDislikeWrapper post_id={article_data?.id || ""} />
        <SocialShare articleUrl={articleUrl} />
        <CommentsSection post_id={article_data?.id || ""} />
        <Newsletter />

        <SlideBannerClient position="SLIDER" local="Pagina_artigo" local_site="Pagina_artigo" />

        <Most_posts_views />
        <BackToTopButton />
      </div>

      <MarketingPopup position="POPUP" local="Pagina_artigo" />
    </BlogLayout>
  );
}