"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { setupAPIClient } from "@/services/api";
import { AuthContext } from "@/contexts/AuthContext";
import { Input } from "@/app/components/input";
import { SidebarAndHeader } from "@/app/components/sidebarAndHeader";
import { Section } from "@/app/components/section";
import { TitlePage } from "@/app/components/titlePage";
import CategoriesList from "@/app/components/categories/categoriesList";
import { FiUpload } from "react-icons/fi";
import Image from "next/image";
import BulkDatas from "@/app/components/bulkDatas";

const schema = z.object({
    name_category: z.string().nonempty("O campo nome é obrigatório"),
    parentId: z.string().optional(),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddCategory() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<any[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [photo, setPhoto] = useState<File | null>(null);

    const refetchCategories = () => {
        const event = new Event("refetchCategories");
        window.dispatchEvent(event);
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const fetchAvailableCategories = async () => {
        try {
            const apiClient = setupAPIClient();
            const response = await apiClient.get('/category/cms');
            setAvailableCategories(response.data.all_categories_disponivel);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    useEffect(() => {
        fetchAvailableCategories();
    }, []);

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;

        const image = e.target.files[0];
        if (!image) return;

        if (image.type === "image/jpeg" || image.type === "image/png") {
            setPhoto(image);
            setAvatarUrl(URL.createObjectURL(image));
        } else {
            toast.error("Formato de imagem inválido. Selecione uma imagem JPEG ou PNG.");
        }
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("user_id", user?.id || "");
            formData.append("name_category", data.name_category);
            formData.append("description", data.description || "");
            if (data.parentId) {
                formData.append("parentId", data.parentId);
            }

            if (photo) {
                formData.append("file", photo);
            }

            const apiClient = setupAPIClient();
            await apiClient.post('/category/create', formData);

            toast.success("Categoria cadastrada com sucesso!");
            reset();
            setAvatarUrl(null);
            setPhoto(null);
            refetchCategories();
            fetchAvailableCategories();
        } catch (error) {
            toast.error("Erro ao cadastrar a categoria.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SidebarAndHeader>
            <Section>
                <TitlePage title="CADASTRAR E GERENCIAR CATEGORIAS" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center">
                            <label className="relative w-full h-[200px] rounded-lg cursor-pointer flex justify-center bg-gray-200 overflow-hidden mb-6">
                                <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-300">
                                    <FiUpload size={30} color="#ff6700" />
                                </span>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFile}
                                    className="hidden"
                                />
                                {avatarUrl ? (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                        <Image
                                            className="object-cover w-full h-full"
                                            src={avatarUrl}
                                            width={250}
                                            height={200}
                                            alt="Preview da imagem"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <FiUpload size={30} color="#ff6700" />
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Input
                                styles="border-2 rounded-md h-12 px-3 w-full"
                                type="text"
                                placeholder="Digite um nome..."
                                name="name_category"
                                error={errors.name_category?.message}
                                register={register}
                            />

                            <div>
                                <label htmlFor="parentId" className="block text-sm font-medium text-[#FFFFFF]">
                                    Subcategoria de alguma categoria?
                                </label>
                                <select
                                    {...register("parentId")}
                                    className="border-2 rounded-md h-12 px-3 w-full text-black"
                                    defaultValue=""
                                >
                                    <option value="">Nenhuma (Categoria Raiz)</option>
                                    {availableCategories.map(category => (
                                        <option className="text-black" key={category.id} value={category.id}>
                                            {category.name_category}
                                        </option>
                                    ))}
                                </select>
                                {errors.parentId && <p className="text-red-500 text-xs">{errors.parentId.message}</p>}
                            </div>
                        </div>

                        <div>
                            <textarea
                                {...register("description")}
                                className="border-2 rounded-md h-56 p-3 w-full resize-none text-black"
                                placeholder="Digite uma descrição para a categoria..."
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-backgroundButton text-[#FFFFFF] rounded hover:bg-hoverButtonBackground transition duration-300"
                            >
                                {loading ? "Cadastrando..." : "Cadastrar Categoria"}
                            </button>
                        </div>
                    </form>

                    <div className="flex items-start justify-center">
                        <BulkDatas
                            link_donwload="/category/donwload_excel_categories?user_id"
                            name_file="modelo_categorias.xlsx"
                            link_register_data="/category/bulk_categories?user_id"
                        />
                    </div>
                </div>

                <CategoriesList refetchCategories={refetchCategories} />
            </Section>
        </SidebarAndHeader>
    );
}