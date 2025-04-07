"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface TitleProps {
    title: string;
    description: string;
}

export default function SectionTitlePage({ title, description }: TitleProps) {

    const { colors } = useTheme();

    return (
        <section
            className="text-center py-11"
            style={{ color: colors?.primaryColor || '#ffffff', background: colors?.fifthColor || '#1f2937' }}
        >
            <h1
                className="text-3xl font-bold"
                style={{ color: colors?.primaryColor || '#ffffff' }}
            >
                {title}
            </h1>
            <p
                className="mt-2"
                style={{ color: colors?.primaryColor || '#ffffff' }}
            >
                {description}
            </p>
        </section>
    );
}