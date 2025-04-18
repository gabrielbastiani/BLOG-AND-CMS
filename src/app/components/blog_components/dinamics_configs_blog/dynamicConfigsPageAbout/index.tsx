'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';

interface BlogConfigs {
    about_author_blog?: string;
    description_blog?: string;
}

interface DynamicContentProps {
    initialConfigs: BlogConfigs | null;
}

const DynamicConfigsPageAbout = ({ initialConfigs }: DynamicContentProps) => {

    const { colors } = useTheme();

    const [configs, setConfigs] = useState<BlogConfigs | null>(initialConfigs);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        let isMounted = true;

        const fetchConfigs = async () => {
            try {
                const response = await fetch(`${API_URL}/configuration_blog/get_configs?t=${Date.now()}`);

                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

                const data = await response.json();

                // Verificação da estrutura correta
                if (data && typeof data === 'object' && 'about_author_blog' in data && 'description_blog' in data) {
                    if (isMounted) {
                        setConfigs(prev => ({
                            ...(prev || {}),
                            ...data // Agora usamos o objeto direto
                        }));
                    }
                } else {
                    console.warn('Estrutura inesperada:', data);
                }
            } catch (error) {
                console.error('Erro na atualização:', error);
            }
        };

        fetchConfigs();
        const interval = setInterval(fetchConfigs, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [API_URL]);

    return (
        <div className="container mx-auto my-12 px-6">
            <h1
                className="text-4xl font-bold text-center mb-12"
                style={{ color: colors?.titulo_pagina_sobre || '#000000' }}
            >
                Sobre
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div
                    className="shadow-lg rounded-lg p-8"
                    style={{ background: colors?.fundo_blocos_sobre || '#ffffff' }}
                >
                    <h2
                        className="text-2xl font-semibold text-gray-700 mb-4"
                        style={{ color: colors?.titulo_sobre_pagina_sobre || '#000000' }}
                    >
                        Sobre o autor do blog
                    </h2>
                    <p
                        className="text-gray-600 leading-relaxed"
                        style={{ color: colors?.texto_sobre_pagina || '#000000' }}
                    >
                        {configs?.about_author_blog || 'Conteúdo padrão...'}
                    </p>
                </div>

                <div
                    className="shadow-lg rounded-lg p-8"
                    style={{ background: colors?.fundo_blocos_sobre || '#ffffff' }}
                >
                    <h2
                        className="text-2xl font-semibold text-gray-700 mb-4"
                        style={{ color: colors?.titulo_sobre_pagina_sobre || '#000000' }}
                    >
                        Sobre o blog
                    </h2>
                    <p
                        className="text-gray-600 leading-relaxed"
                        style={{ color: colors?.texto_sobre_pagina || '#000000' }}
                    >
                        {configs?.description_blog || 'Descrição padrão...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DynamicConfigsPageAbout;