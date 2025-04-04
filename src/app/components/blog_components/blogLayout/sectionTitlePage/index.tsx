"use client";

import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";

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

interface TitleProps {
    title: string;
    description: string;
}

export default function SectionTitlePage({ title, description }: TitleProps) {

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

    return (
        <section
            className="text-center py-11"
            style={{ color: theme?.primaryColor || '#ffffff', background: theme?.fifthColor || '#1f2937' }}
        >
            <h1
                className="text-3xl font-bold"
                style={{ color: theme?.primaryColor || '#ffffff' }}
            >
                {title}
            </h1>
            <p
                className="mt-2"
                style={{ color: theme?.primaryColor || '#ffffff' }}
            >
                {description}
            </p>
        </section>
    );
}