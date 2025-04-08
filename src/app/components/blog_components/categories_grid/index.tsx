"use client"

import { useTheme } from "@/contexts/ThemeContext";
import { setupAPIClient } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CategoriesProps {
    id: string;
    name_category: string;
    slug_name_category: string;
    image_category: string;
}

export default function Categories_grid() {

    const { colors } = useTheme();

    const [categories, setCategories] = useState<CategoriesProps[]>([]);

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
                style={{ color: colors?.titulo_categorias_pagina_inicial || '#000000' }}
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
                                style={{ background: colors?.fundo_blocos_categorias_pagina_inicial || '#797a7b' }}
                            >
                                <h3
                                    className="text-lg font-bold"
                                    style={{ color: colors?.texto_categorias_pagina_inicial || '#ffffff' }}
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