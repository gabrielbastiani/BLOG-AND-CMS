"use client";

import { setupAPIClient } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

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

const contactFormSchema = z.object({
    email_user: z.string().email("E-mail inválido"),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export function Newsletter() {

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

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormInputs>({
        resolver: zodResolver(contactFormSchema),
    });

    async function onSubmit(data: ContactFormInputs) {
        try {
            const apiClient = setupAPIClient();

            await apiClient.post(`/newsletter/create_newsletter`, {
                email_user: data.email_user
            });

            reset();
            toast.success("Cadastrado com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            toast.error("Erro ao cadastrar o formulario.")
        }
    };

    return (
        <section
            className="py-12"
            style={{ background: theme?.fourthbackgroundColor || '#6b7280' }}
        >
            <div className="container mx-auto text-center">
                <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: theme?.primaryColor || '#ffffff' }}
                >
                    Assine nossa newsletter
                </h2>
                <p
                    className="mb-6"
                    style={{ color: theme?.secondaryColor || '#000000' }}
                >
                    Receba as últimas notícias direto no seu email!
                </p>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex justify-center gap-4"
                >
                    <input
                        type="email"
                        placeholder="Seu email"
                        {...register("email_user")}
                        className="text-black p-3 w-1/2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                        type="submit"
                        className="p-3 rounded-lg hover:bg-hoverButtonBackground"
                        style={{ color: theme?.primaryColor || '#ffffff', background: theme?.sixthColor || '#f97316' }}
                    >
                        Inscrever-se
                    </button>
                </form>
            </div>
        </section>
    )
}