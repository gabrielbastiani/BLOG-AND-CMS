'use client'

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { setupAPIClient } from '@/services/api';
import ColorPicker from '@/app/components/colorPicker';
import { SidebarAndHeader } from '@/app/components/sidebarAndHeader';
import { Section } from '@/app/components/section';
import { TitlePage } from '@/app/components/titlePage';
import { toast } from 'react-toastify';

const ThemeEditor = () => {
    const { colors, setColors } = useTheme();
    const [newColorName, setNewColorName] = useState('');
    const api = setupAPIClient();

    const handleAddColor = () => {
        if (newColorName.trim()) {
            const sanitizedName = newColorName.trim().toLowerCase().replace(/\s+/g, '-');
            setColors({ ...colors, [sanitizedName]: '#FFFFFF' });
            setNewColorName('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/theme', { colors });
            toast.success('Cores salvas com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar cores');
        }
    };

    const handleDeleteColor = async (colorName: string) => {
        if (window.confirm(`Deseja excluir a cor "${colorName}" permanentemente?`)) {
            try {
                const response = await api.delete(`/theme/${colorName}`);

                if (response.data.success) {
                    setColors(response.data.colors);
                    toast.success('Cor excluída com sucesso!');
                }
            } catch (error) {
                toast.error('Erro ao excluir cor');/* @ts-ignore */
                console.error('Detalhes do erro:', error.response?.data);
            }
        }
    };

    return (
        <SidebarAndHeader>
            <Section>
                <TitlePage title="Personalização de Cores" />

                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                    <div className="space-y-4">
                        {Object.entries(colors).map(([name, value]) => (
                            <ColorPicker
                                key={name}
                                name={name}
                                value={value}
                                onChange={(color) => setColors({ ...colors, [name]: color })}
                            />
                        ))}
                    </div>

                    {/* <div className="border-t pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Nome da nova cor (ex: botao-primario)"
                                    className="w-full p-2 border rounded text-black"
                                    value={newColorName}
                                    onChange={(e) => setNewColorName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                                />
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                onClick={handleAddColor}
                            >
                                Adicionar Cor
                            </button>
                        </div>
                    </div> */}

                    <button
                        type="submit"
                        className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Salvar configurações
                    </button>
                </form>
            </Section>
        </SidebarAndHeader>
    );
};

export default ThemeEditor;