"use client"

import { useState, useEffect, useMemo } from 'react';
import { setupAPIClient } from '@/services/api';
import ColorPicker from '@/app/components/colorPicker';
import { defaultThemeColors } from '@/app/components/colorPicker/constants';
import { SidebarAndHeader } from '@/app/components/sidebarAndHeader';
import { Section } from '@/app/components/section';
import { TitlePage } from '@/app/components/titlePage';
import { toast } from 'react-toastify';

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

const Theme = () => {

    const [colors, setColors] = useState<ThemeColors | null>(null);
    const [loading, setLoading] = useState(true);

    const apiClient = useMemo(() => setupAPIClient(), []);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const response = await apiClient.get<ThemeColors>('/theme');
                setColors({
                    ...defaultThemeColors,
                    ...response.data
                });
            } catch (error) {
                console.error('Error fetching theme:', error);
                setColors(defaultThemeColors);
            } finally {
                setLoading(false);
            }
        };
        fetchTheme();
    }, [apiClient]);

    const handleColorChange = (name: keyof ThemeColors, value: string) => {
        setColors(prev => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.put('/theme', colors);
            toast.success('Cor atualizada com sucesso!');
        } catch (error) {
            console.error('Error updating theme:', error);
            toast.error('Erro ao atualizar cor.');
        }
    };

    if (loading) {
        return <div>Carregando cores do blog...</div>;
    }

    if (!colors) {
        return <div>Erro ao carregar cores do blog.</div>;
    }

    return (
        <SidebarAndHeader>
            <Section>

                <TitlePage title="CORES DO BLOG" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <ColorPicker
                        label="Primeira cor"
                        value={colors.primaryColor}
                        onChange={(v: string) => handleColorChange('primaryColor', v)}
                    />
                    <ColorPicker
                        label="Segunda cor"
                        value={colors.secondaryColor}
                        onChange={(v: string) => handleColorChange('secondaryColor', v)}
                    />
                    <ColorPicker
                        label="Terceira cor"
                        value={colors.thirdColor}
                        onChange={(v: string) => handleColorChange('thirdColor', v)}
                    />
                    <ColorPicker
                        label="Quarta cor"
                        value={colors.fourthColor}
                        onChange={(v: string) => handleColorChange('fourthColor', v)}
                    />
                    <ColorPicker
                        label="Quinta cor"
                        value={colors.fifthColor}
                        onChange={(v: string) => handleColorChange('fifthColor', v)}
                    />
                    <ColorPicker
                        label="Sexta cor"
                        value={colors.sixthColor}
                        onChange={(v: string) => handleColorChange('sixthColor', v)}
                    />
                    <ColorPicker
                        label="Primeira cor de fundo"
                        value={colors.primarybackgroundColor}
                        onChange={(v: string) => handleColorChange('primarybackgroundColor', v)}
                    />
                    <ColorPicker
                        label="Segunda cor de fundo"
                        value={colors.secondarybackgroundColor}
                        onChange={(v: string) => handleColorChange('secondarybackgroundColor', v)}
                    />
                    <ColorPicker
                        label="Terceira cor de fundo"
                        value={colors.thirdbackgroundColor}
                        onChange={(v: string) => handleColorChange('thirdbackgroundColor', v)}
                    />
                    <ColorPicker
                        label="Quarta cor de fundo"
                        value={colors.fourthbackgroundColor}
                        onChange={(v: string) => handleColorChange('fourthbackgroundColor', v)}
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Salvar
                    </button>
                </form>

            </Section>
        </SidebarAndHeader>
    );
};

export default Theme;