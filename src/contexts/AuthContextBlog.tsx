"use client"

import { createContext, ReactNode, useState, useEffect } from 'react';
import { api_blog } from '../services/apiClientBlog';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { api } from '@/services/apiClient';

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    loadingAuth?: boolean;
    signIn: (credentials: SignInProps) => Promise<boolean>;
    signOut: () => void;
    updateUser: (newUserData: Partial<UserProps>) => void;
    configs?: ConfigProps;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
    image_user?: string;
    role?: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

interface ConfigProps {
    name_blog?: string;
    logo?: string;
    email_blog?: string;
    phone?: string;
    favicon?: string;
    description_blog?: string;
    author_blog?: string;
    privacy_policies?: string;
}

export const AuthContextBlog = createContext({} as AuthContextData);

export function AuthProviderBlog({ children }: AuthProviderProps) {

    const [configs, setConfigs] = useState<ConfigProps>({
        name_blog: "",
        logo: "",
        email_blog: "",
        phone: "",
        favicon: "",
        description_blog: "",
        author_blog: "",
        privacy_policies: "",
    });
    const [cookies, setCookie, removeCookie] = useCookies(['@blog.token']);
    const [cookiesId, setCookieId, removeCookieId] = useCookies(['@idUserBlog']);
    const [user, setUser] = useState<UserProps>();
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const isAuthenticated = !!user;

    useEffect(() => {
        async function loadConfigs() {
            try {
                const response = await api.get(`/configuration_blog/get_configs`);

                if (response.status === 200) {
                    const defaultConfigs: ConfigProps = {
                        name_blog: "Blog Padrão",
                        logo: "../assets/no-image-icon-6.png",
                        email_blog: "contato@blog.com",
                        phone: "(00) 0000-0000",
                        favicon: "../../src/app/favicon.ico",
                        description_blog: "Sem descrição",
                        author_blog: "Seu nome",
                        privacy_policies: "Sua politica"
                    };

                    setConfigs(response.data || defaultConfigs);
                }
            } catch (error) {
                // Tratamento de tipo seguro
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        console.warn("Endpoint não encontrado. Usando configurações padrão.");
                        setConfigs({
                            name_blog: "Blog Padrão",
                            logo: "../assets/no-image-icon-6.png",
                            email_blog: "contato@blog.com",
                            phone: "(00) 0000-0000",
                            favicon: "../../src/app/favicon.ico",
                            description_blog: "Sem descrição",
                            author_blog: "Seu nome",
                            privacy_policies: "Sua politica"
                        });
                    } else {
                        console.error("Erro na requisição:", error.message);
                    }
                } else {
                    console.error("Erro desconhecido:", error);
                }
            }
        }
        loadConfigs();
    }, []);

    async function signIn({ email, password }: SignInProps): Promise<boolean> {
        setLoadingAuth(true);
        try {
            const response = await api_blog.post('/user/user_blog/session', { email, password });
            const { id, token } = response.data;

            const cookieOptions = {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const
              };

            setCookie('@blog.token', token, cookieOptions);
            setCookieId('@idUserBlog', id, cookieOptions);

            api_blog.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso!');
            setUser({ id, name: response.data.name, email });
            return true;
        } catch (err: any) {
            toast.error("Erro ao acessar");
            toast.error(`${err.response.data.error}`);
            console.log("Erro ao acessar", err);
            return false;
        } finally {
            setLoadingAuth(false);
        }
    }

    const updateUser = (newUserData: Partial<UserProps>) => {
        if (user) {
            setUser({
                ...user,
                ...newUserData,
            });
        }
    };

    useEffect(() => {
        let token = cookies['@blog.token'];
        let userid = cookiesId['@idUserBlog'];

        async function loadUserData() {
            if (token) {
                try {
                    const response = await api_blog.get(`/user/user_blog/me?user_id=${userid}`);

                    const { id, name, email, image_user } = response.data;

                    setUser({
                        id,
                        name,
                        email,
                        image_user
                    });

                } catch (error) {
                    console.error("Erro ao carregar dados do usuário: ", error);
                }
            }

            setLoadingAuth(false);
        }

        loadUserData();
    }, [cookies, cookiesId]);

    function signOut() {
        try {
            removeCookie('@blog.token', { path: '/' });
            removeCookieId('@idUserBlog', { path: '/' });
            setUser(undefined);
            toast.success('Usuário deslogado com sucesso!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            toast.error("OPS... Erro ao deslogar");
        }
    }

    return (
        <AuthContextBlog.Provider value={{ configs, user, isAuthenticated, loadingAuth, signIn, signOut, updateUser }}>
            {children}
        </AuthContextBlog.Provider>
    )
}