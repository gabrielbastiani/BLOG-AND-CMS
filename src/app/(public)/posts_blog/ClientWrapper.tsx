"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { setupAPIClient } from "@/services/api";
import Image from "next/image";
import { PostsProps } from "Types/types";
import Params_nav_blog from "@/app/components/blog_components/params_nav_blog";
import DOMPurify from "dompurify";
import { useTheme } from "@/contexts/ThemeContext";

interface ClientWrapperProps {
    all_posts: PostsProps[];
    totalPages: number;
}

export default function ClientWrapper({
    all_posts,
    totalPages,
}: ClientWrapperProps) {

    const { colors } = useTheme();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [posts, setPosts] = useState(all_posts);
    const [currentTotalPages, setTotalPages] = useState(totalPages);
    const [sanitizedContents, setSanitizedContents] = useState<{ [key: string]: string }>({});

    const apiClient = setupAPIClient();

    useEffect(() => {
        const sanitizeAllContent = () => {
            const newContents: { [key: string]: string } = {};

            for (const post of posts) {
                const cleanHtml = DOMPurify.sanitize(post.text_post || "", {
                    USE_PROFILES: { html: true },
                    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br']
                });

                newContents[post.id] = cleanHtml.length > 120
                    ? `${cleanHtml.slice(0, 200)}...`
                    : cleanHtml;
            }

            setSanitizedContents(newContents);
        };

        sanitizeAllContent();
    }, [posts]);

    const formatViews = (views: number): string => {
        if (views >= 1_000_000) return `${(views / 1e6).toFixed(1).replace(".0", "")} Mi`;
        if (views >= 1_000) return `${(views / 1e3).toFixed(1).replace(".0", "")} Mil`;
        return views.toString();
    };

    const columnsOrder = [
        { key: "title", label: "titulo" },
        { key: "created_at", label: "data" }
    ];

    const availableColumnsOrder = ["title", "created_at"];
    const customNamesOrder = { title: "titulo", created_at: "data" };

    async function fetchPosts({ page, limit, search, orderBy, orderDirection }: any) {
        try {
            const response = await apiClient.get(`/post/articles/blog`, {
                params: { page, limit, search, orderBy, orderDirection }
            });
            setPosts(response.data.posts);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Params_nav_blog
            active_buttons_searchInput_notification={false}
            active_buttons_searchInput_comments={false}
            customNamesOrder={customNamesOrder}
            availableColumnsOrder={availableColumnsOrder}
            columnsOrder={columnsOrder}
            availableColumns={[]}
            table_data="post"
            data={posts}
            totalPages={currentTotalPages}
            onFetchData={fetchPosts}
        >
            <section
                className="container mx-auto my-12 px-4"

            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <article
                            key={post.id}
                            className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                            style={{ background: colors?.fundo_blocos_todos_posts || '#ffffff' }}
                        >
                            <Image
                                src={`${API_URL}/files/${post.image_post}`}
                                width={160}
                                height={140}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />

                            <div className="p-4">
                                <h2
                                    className="text-lg font-bold hover:text-red-600"
                                    style={{ color: colors?.titulo_post_blocos_todos_posts || '#000000' }}
                                >
                                    {post.title}
                                </h2>

                                <div
                                    className="text-sm mt-2 flex"
                                    style={{ color: colors?.dados_post_blocos_todos_posts || '#6b7280' }}
                                >
                                    <span className="flex mr-3">
                                        <FaRegEye className="text-lg mr-3" />
                                        {formatViews(post?.views || 0)}
                                    </span>
                                    <span>
                                        Publicado em: {new Date(post.publish_at || post.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {post.categories?.map((cat) => (
                                        <Link
                                            key={cat.category?.id}
                                            href={`/posts_categories/${cat.category?.slug_name_category}`}
                                            className="text-xs bg-green-100 text-green-600 py-1 px-2 rounded-full hover:bg-green-200"
                                        >
                                            {cat.category?.name_category}
                                        </Link>
                                    ))}
                                </div>

                                <p
                                    className="text-sm mt-4"
                                    style={{ color: colors?.mini_descricao_post_blocos_todos_posts || '#4b5563' }}
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizedContents[post.id] || "Carregando conteúdo..."
                                    }}
                                ></p>

                                <div
                                    className="mt-4 text-sm"
                                    style={{ color: colors?.dados_post_blocos_todos_posts || '#6b7280' }}
                                >
                                    <p>Por: {post.author}</p>
                                </div>

                                <Link
                                    href={`/article/${post.custom_url || post.slug_title_post}`}
                                    className="block text-red-600 mt-4 text-center font-semibold"
                                    style={{ color: colors?.leia_mais_post_blocos_todos_posts || '#6b7280' }}
                                >
                                    Leia mais
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </Params_nav_blog>
    );
}