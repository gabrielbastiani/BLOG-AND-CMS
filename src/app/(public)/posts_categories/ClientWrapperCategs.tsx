"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { Key } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ClientWrapperProps {
    categories: any;
}

export default function ClientWrapperCategs({ categories }: ClientWrapperProps) {

    const { colors } = useTheme();

    return (
        <div className="container mx-auto my-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category: { id: Key | null | undefined; image_category: any; slug_name_category: any; name_category: any; description: string | any[]; children: any[]; }) => (
                    <div
                        key={category.id}
                        className="relative rounded-lg shadow-lg overflow-hidden group"
                        style={{ background: colors?.fifthColor || '#1f2937' }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-75 group-hover:opacity-100 transition-opacity"
                            style={{
                                backgroundImage: `url(${category.image_category ?
                                    `${API_URL}/files/${category.image_category}` :
                                    '../../../assets/no-image-icon-6.png'})`
                            }}
                        ></div>

                        <div className="relative p-6 bg-gradient-to-t from-black via-transparent to-transparent">
                            <Link
                                href={`/posts_categories/${category.slug_name_category}`}
                                className="text-2xl font-bold mb-2 block"
                                style={{ color: colors?.primaryColor || '#ffffff' }}
                            >
                                {category.name_category}
                            </Link>
                            <p className="text-gray-300 text-sm mb-4">
                                {category.description?.slice(0, 100)}
                                {category.description?.length > 100 && "..."}
                            </p>
                            {category.children.length >= 1 && (
                                <div className="mt-4">
                                    <span className="text-red-400">SUBCATEGORIAS:</span>
                                    <ul className="mt-2">
                                        {category.children.map((subcategory) => (
                                            <li
                                                key={subcategory.id}
                                                className="mb-1"
                                                style={{ color: colors?.sixthColor || '#f97316' }}
                                            >
                                                <Link
                                                    href={`/posts_categories/${subcategory.slug_name_category}`}
                                                    className="text-backgroundButton hover:underline text-sm"
                                                    style={{ color: colors?.sixthColor || '#f97316' }}
                                                >
                                                    {subcategory.name_category}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}