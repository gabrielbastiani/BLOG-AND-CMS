"use client";

import { useState } from "react";
import Params_nav_blog from "@/app/components/blog_components/params_nav_blog";
import Link from "next/link";
import Image from "next/image";
import { PostsProps } from "../../../../Types/types";
import { setupAPIClient } from "@/services/api";
import DOMPurify from "dompurify";
import { useTheme } from "@/contexts/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ClientWrapperProps {
    category_slug: string;
    initialPosts: PostsProps[];
    totalPages: number;
}

export default function ClientWrapper({
    category_slug,
    initialPosts,
    totalPages,
}: ClientWrapperProps) {

    const { colors } = useTheme();

    const [all_posts, setAll_posts] = useState(initialPosts);
    const [currentTotalPages, setTotalPages] = useState(totalPages);

    const apiClient = setupAPIClient();

    const columnsOrder = [
        { key: "title", label: "titulo" },
        { key: "created_at", label: "data" }
    ];

    const availableColumnsOrder = ["title", "created_at"];
    const customNamesOrder = { title: "titulo", created_at: "data" };

    async function fetchPosts({ page, limit, search, orderBy, orderDirection }: any) {
        try {
            const response = await apiClient.get(`/category/on_posts`, {
                params: { slug_name_category: category_slug, page, limit, search, orderBy, orderDirection }
            });
            setAll_posts(response.data.posts);
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
            data={all_posts}
            totalPages={currentTotalPages}
            onFetchData={fetchPosts}
        >
            <section
                className="container mx-auto my-12 px-4"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {all_posts.length === 0 ? (
                        <h1
                            style={{ color: colors?.secondaryColor || '#000000' }}
                        >
                            Nenhum artigo atribuído a essa categoria no momento...
                        </h1>
                    ) : (
                        all_posts.map((post) => (
                            <article
                                key={post.id}
                                className="rounded-lg shadow-md hover:shadow-lg transition duration-300"
                                style={{ background: colors?.fundo_blocos_todos_posts || '#ffffff' }}
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={`${API_URL}/files/${post.image_post}`}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                <div className="p-4">
                                    <h2
                                        className="text-lg font-bold hover:text-red-600"
                                        style={{ color: colors?.titulo_post_blocos_todos_posts || '#000000' }}
                                    >
                                        {post.title}
                                    </h2>

                                    <div
                                        className="text-sm mt-2"
                                        style={{ color: colors?.dados_post_blocos_todos_posts || '#6b7280' }}
                                    >
                                        <span>
                                            Publicado em: {new Date(post.publish_at || post.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {post.categories?.map((cat) => (
                                            <Link
                                                key={cat.category?.id}
                                                href={`/posts_categories/${cat.category?.slug_name_category}`}
                                                className="text-xs text-green-600 py-1 px-2 rounded-full hover:bg-green-200"
                                                style={{ background: colors?.fundo_categoria_no_bloco_do_post || '#dcfce7', color: colors?.texto_nome_categoria_no_bloco_do_post || "#16a34a" }}
                                            >
                                                {cat.category?.name_category}
                                            </Link>
                                        ))}
                                    </div>

                                    <p
                                        className="text-sm mt-4"
                                        style={{ color: colors?.mini_descricao_post_blocos_todos_posts || '#4b5563' }}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(post.text_post.length > 120
                                                ? `${post.text_post.slice(0, 200)}...`
                                                : post.text_post),
                                        }}
                                    ></p>

                                    <div className="mt-4 text-gray-500 text-sm">
                                        <p>Por: {post.author}</p>
                                    </div>

                                    <Link
                                        href={`/article/${post.custom_url || post.slug_title_post}`}
                                        className="block text-red-600 mt-4 text-center font-semibold"
                                    >
                                        Leia mais
                                    </Link>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </Params_nav_blog>
    );
}