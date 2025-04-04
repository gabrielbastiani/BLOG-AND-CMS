"use client"

import Image from "next/image";
import noImage from '../../../../assets/no-image-icon-6.png';
import { useEffect, useState } from "react";
import Link from "next/link";
import { setupAPIClient } from "@/services/api";
import { PostsProps } from "../../../../../Types/types";

interface ThemeColors {
    primaryColor: string;
    secondaryColor: string;
    thirdColor: string;
    fourthColor: string;
    fifthColor: string;
    sixthColor: string;
    primarybackgroundColor: string;
    secondarybackgroundColor: string;
    thirdbackgroundColor: string;
    fourthbackgroundColor: string;
}

export default function Last_post() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [last_posts, setLast_posts] = useState<PostsProps[]>([]);
    const [theme, setTheme] = useState<ThemeColors>();

    useEffect(() => {
        const fetchTheme = async () => {
            const apiClient = setupAPIClient();
            try {
                const response = await apiClient.get('/theme');
                setTheme(response.data);
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        };
        fetchTheme();
        const interval = setInterval(fetchTheme, 10000);
        return () => {
            clearInterval(interval);
        };
    }, []);

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
                style={{ color: theme?.secondaryColor || '#000000' }}
            >
                Últimos Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {last_posts.slice(0, 6).map((post) => (
                    <div
                        key={post.id}
                        className="rounded shadow p-4 hover:shadow-lg transition"
                        style={{ background: theme?.secondarybackgroundColor || '#f3f4f6' }}
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
                                style={{ color: theme?.secondaryColor || '#000000' }}
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