"use client"

import Image from "next/image";
import noImage from '../../../../assets/no-image-icon-6.png';
import { useEffect, useState } from "react";
import Link from "next/link";
import { setupAPIClient } from "@/services/api";
import { PostsProps } from "../../../../../Types/types";
import { useTheme } from "@/contexts/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Last_post() {

    const { colors } = useTheme();

    const [last_posts, setLast_posts] = useState<PostsProps[]>([]);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function lastposts() {
            try {
                const { data } = await apiClient.get(`/post/articles/blog`);
                setLast_posts(data.last_post);
            } catch (error) {
                console.log(error);
            }
        }
        lastposts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors?.titulo_ultimos_posts || '#000000' }}
            >
                Últimos Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {last_posts.slice(0, 6).map((post) => (
                    <div
                        key={post.id}
                        className="rounded shadow p-4 hover:shadow-lg transition"
                        style={{ background: colors?.fundo_ultimos_posts || '#e5e9ee' }}
                    >
                        <Link href={`/article/${post.custom_url ? post.custom_url : post.slug_title_post}`}>
                            <Image
                                src={post.image_post ? `${API_URL}/files/${post.image_post}` : noImage}
                                alt={post.title}
                                width={280}
                                height={80}
                                quality={100}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3
                                className="text-lg font-semibold"
                                style={{ color: colors?.texto_ultimos_posts || '#000000' }}
                            >
                                {post.title}
                            </h3>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}