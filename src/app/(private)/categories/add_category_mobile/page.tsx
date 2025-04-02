"use client";

import { useContext, useEffect, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { AuthContext } from "@/contexts/AuthContext";
import { SidebarAndHeader } from "@/app/components/sidebarAndHeader";
import { Section } from "@/app/components/section";
import { TitlePage } from "@/app/components/titlePage";
import { toast } from "react-toastify";
import { FiChevronRight, FiMoreVertical, FiArrowUp } from "react-icons/fi";

interface Category {
    depth: number;
    id: string;
    name_category: string;
    parentId: string | null;
    children: Category[];
    order: number;
}

export default function ManageCategoriesMobile() {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showMoveOptions, setShowMoveOptions] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/category/cms');
            setCategories(response.data.rootCategories);
        } catch (error) {
            toast.error("Erro ao carregar categorias");
        }
    };

    const handleCategoryPress = (category: Category) => {
        setSelectedCategory(category);
        setShowMoveOptions(true);
    };

    const moveCategory = async (targetId: string | null) => {
        if (!selectedCategory) return;

        try {
            const apiClient = setupAPIClient();
            await apiClient.put(`/category/updateOrder`, {
                draggedId: selectedCategory.id,
                targetId: targetId
            });

            // Atualização otimista com recarregamento
            const response = await apiClient.get('/category/cms');
            setCategories(response.data.rootCategories);

            toast.success("Categoria movida com sucesso!");
        } catch (error) {
            console.error("Erro detalhado:", error);
            toast.error("Erro ao mover categoria");
        } finally {
            setShowMoveOptions(false);
            setSelectedCategory(null);
        }
    };

    const renderCategoryTree = (items: Category[], parentId: string | null = null, depth: number = 0) => {
        return items
            .filter(item => item.parentId === parentId)
            .sort((a, b) => a.order - b.order)
            .map((item) => (
                <div key={item.id} className="text-black"> {/* Adicionado text-black aqui */}
                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-1 
                        border-l-4 border-blue-200 hover:border-blue-400 transition-all"
                        style={{ marginLeft: `${depth * 20}px` }}>
                        <div className="flex items-center flex-1">
                            {item.children.length > 0 && <FiChevronRight className="mr-2 text-black" />}
                            <span className="font-medium text-black">{item.name_category}</span>
                        </div>
                        <button
                            onClick={() => handleCategoryPress(item)}
                            className="p-2 hover:bg-gray-200 rounded-full text-black"
                        >
                            <FiMoreVertical />
                        </button>
                    </div>

                    {item.children.length > 0 && (
                        <div className="ml-4 border-l-2 border-gray-300">
                            {renderCategoryTree(item.children, item.id, depth + 1)}
                        </div>
                    )}
                </div>
            ));
    };

    const MoveOptionsModal = () => {
        const flattenCategories = (items: Category[], depth: number = 0): Category[] => {
            return items.reduce<Category[]>((acc, item) => {
                return [
                    ...acc,
                    { ...item, depth },
                    ...flattenCategories(item.children, depth + 1)
                ];
            }, []);
        };

        const allCategories = flattenCategories(categories);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="w-full bg-white rounded-lg max-h-[80vh] overflow-y-auto 
                    shadow-xl max-w-2xl text-black"> {/* Adicionado text-black aqui */}
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-black">Mover categoria</h3>
                            <button
                                onClick={() => setShowMoveOptions(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <button
                            onClick={() => moveCategory(null)}
                            className="w-full p-3 bg-gray-100 rounded-lg flex items-center mb-4
                                hover:bg-gray-200 transition-colors text-black"
                        >
                            <FiArrowUp className="mr-2" />
                            Tornar categoria raiz
                        </button>

                        <div className="space-y-2">
                            {allCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => moveCategory(category.id)}
                                    className={`w-full p-3 rounded-lg text-left 
                                        ${category.id === selectedCategory?.id ?
                                            'bg-gray-300 cursor-not-allowed' :
                                            'bg-gray-100 hover:bg-gray-200'}
                                        transition-colors text-black`}
                                    style={{ marginLeft: `${category.depth * 20}px` }}
                                    disabled={category.id === selectedCategory?.id}
                                >
                                    {category.name_category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SidebarAndHeader>
            <Section>
                <TitlePage title="GERENCIAR CATEGORIAS" />

                <div className="p-4 space-y-2">
                    {renderCategoryTree(categories)}
                </div>

                {showMoveOptions && <MoveOptionsModal />}
            </Section>
        </SidebarAndHeader>
    );
}