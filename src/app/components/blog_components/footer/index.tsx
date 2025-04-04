"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContextBlog } from "@/contexts/AuthContextBlog";
import { setupAPIClient } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import noImage from '../../../../assets/no-image-icon-6.png';

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

interface MediasProps {
    id: string;
    name_media: string;
    link: string;
    logo_media: string;
}

export function Footer() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const { configs } = useContext(AuthContextBlog);
    const [dataMedias, setDataMedias] = useState<MediasProps[]>([]);
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
        async function fetchData() {
            try {
                const apiClient = setupAPIClient();
                const { data } = await apiClient.get("/get/media_social");
                setDataMedias(data || []);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    return (
        <footer
            className="py-6 mt-14 z-50"
            style={{ color: theme?.primaryColor || '#ffffff', background: theme?.fifthColor || '#1f2937' }}
        >
            <div className="container mx-auto text-center">
                <div className="flex justify-center space-x-6 mb-5">
                    {dataMedias.map((media) => (
                        <div key={media.id}>
                            {media.logo_media ? (
                                <Link
                                    href={media.link ? media.link : ""}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-gray-300 hover:text-[#FFFFFF]"
                                >
                                    <Image
                                        src={media.logo_media ? `${API_URL}/files/${media.logo_media}` : noImage}
                                        alt={media.name_media ? media.name_media : ""}
                                        width={50}
                                        height={50}
                                        className="w-6 h-6"
                                    />
                                </Link>
                            ) :
                                <Link
                                    href={media.link ? media.link : ""}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-[#FFFFFF] hover:text-gray-300"
                                >
                                    {media.name_media}
                                </Link>
                            }
                        </div>
                    ))}
                </div>
                <Link
                    href="/politicas_de_privacidade"
                    className="mb-5"
                    style={{ color: theme?.primaryColor || '#ffffff' }}
                >
                    Politicas de privacidade
                </Link>
                <p className="mb-4">
                    &copy; {new Date().getFullYear()}{" "}
                    {configs?.name_blog ? configs?.name_blog : "Blog"}. Todos os direitos
                    reservados.
                </p>
            </div>
        </footer>
    );
}