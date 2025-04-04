'use client';

import SafeHTML from '@/app/components/SafeHTML';
import { useEffect, useState } from 'react';

interface BlogConfigs {
    privacy_policies?: string;
}

interface DynamicContentProps {
    initialConfigs: BlogConfigs | null;
}

const DynamicConfigsPagePoliticasPrivacidade = ({ initialConfigs }: DynamicContentProps) => {
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
                if (data && typeof data === 'object' && 'privacy_policies' in data) {
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
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="prose max-w-none text-gray-800 prose-h1:text-orange-600 prose-p:mb-4 prose-a:text-indigo-500 hover:prose-a:underline">
                {configs?.privacy_policies && (
                    <SafeHTML html={configs?.privacy_policies} />
                )}
            </div>
        </div>
    );
};

export default DynamicConfigsPagePoliticasPrivacidade;