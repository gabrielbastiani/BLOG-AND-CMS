"use client"

import { setupAPIClient } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoriesProps {
    id: string;
    name_category: string;
    slug_name_category: string;
    image_category: string;
}

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

export default function Categories_grid() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [categories, setCategories] = useState<CategoriesProps[]>([]);
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
                const categories = await apiClient.get(`/categories/blog/posts`);
                setCategories(categories.data);
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
                Categorias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="relative rounded overflow-hidden h-40 shadow hover:shadow-lg transition"
                    >
                        <Link href={`/posts_categories/${category.slug_name_category}`}>
                            {category.image_category ? (
                                <Image
                                    src={`${API_URL}/files/${category.image_category}`}
                                    alt={category.name_category}
                                    width={80}
                                    height={80}
                                    className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                                />
                            ) : (
                                <div className="bg-black"></div>
                            )}

                            <div
                                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                                style={{ background: theme?.fourthColor || '#797a7b' }}
                            >
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: theme?.primaryColor || '#ffffff' }}
                                >
                                    {category.name_category}
                                </h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}