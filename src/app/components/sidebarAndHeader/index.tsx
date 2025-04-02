import { ReactNode, useContext, useEffect, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ArrowBendDoubleUpLeft, CaretRight } from "phosphor-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

// Contextos e Hooks
import { AuthContext } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

// Componentes
import { CollapsibleMenu } from "./sidebar/sidebarMenu";
import { NotificationDropdown } from "./header/notificationDropdown";
import { UserAvatar } from "./header/notificationDropdown/userAvatar";

// Configurações e tipos
import noImage from '../../../assets/no-image-icon-6.png';

interface Content {
    children: ReactNode;
}

export function SidebarAndHeader({ children }: Content) {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const { user, configs } = useContext(AuthContext);
    const idUser = user?.id;

    // Estados
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    const [currentRoute, setCurrentRoute] = useState<string | null>(null);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Notificações
    const {
        notifications,
        hasUnread,
        markAsRead,
        markAllAsRead
    } = useNotifications(idUser);

    // Efeitos
    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentRoute(window.location.pathname);
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 1024);
            };
            handleResize(); // Verificação inicial
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleMenuToggle = (menuName: string) => {
        setOpenMenu(prev => prev === menuName ? null : menuName);
    };

    // Configuração dos menus
    const menuItems = {
        SUPER_ADMIN: [
            {
                title: 'Usuários',
                name: 'users',
                items: [
                    { title: 'Usuários CMS', path: '/user/all_users' },
                    { title: 'Usuários Blog', path: '/user/users_blog' },
                    { title: 'Adicionar Novo Usuário', path: '/user/add_user' },
                    { title: 'Editar perfil', path: '/user/profile' }
                ]
            },
            {
                title: 'Categorias',
                name: 'categories',
                items: [
                    { title: 'Todas as categorias', path: '/categories/all_categories' },
                    { title: 'Adicionar nova categoria', path: '/categories/add_category' },
                    { title: 'Adicionar nova categoria', path: '/categories/add_category_mobile' }
                ]
            },
            {
                title: 'Tags',
                name: 'tags',
                items: [
                    { title: 'Todas as tags', path: '/tags/all_tags' },
                    { title: 'Adicionar nova tag', path: '/tags/add_tag' }
                ]
            },
            {
                title: 'Artigos',
                name: 'posts',
                items: [
                    { title: 'Todos os posts', path: '/posts/all_posts' },
                    { title: 'Adicionar novo post', path: '/posts/add_post' },
                    { title: 'Comentários', path: '/posts/comments' }
                ]
            },
            {
                title: 'Marketing',
                name: 'marketing_publication',
                items: [
                    { title: 'Todas publicidades', path: '/marketing_publication/all_marketing_publication' },
                    { title: 'Adicionar publicidade', path: '/marketing_publication/add_marketing_publication' },
                    { title: 'Configurar intervalos', path: '/marketing_publication/config_interval_banner' }
                ]
            },
            {
                title: 'Contatos',
                name: 'contacts',
                items: [
                    { title: 'Todos os contatos', path: '/contacts_form/all_contacts' }
                ]
            },
            {
                title: 'Newsletter',
                name: 'newsletter',
                items: [
                    { title: 'Gerenciar assinantes', path: '/newsletter' }
                ]
            },
            {
                title: 'Configurações do blog',
                name: 'configurations',
                items: [
                    { title: 'Configurações gerais', path: '/configurations/configuration' },
                    { title: 'SEO', path: '/configurations/seo_pages' }
                ]
            }
        ],
        ADMIN: [
            {
                title: 'Usuários',
                name: 'users',
                items: [
                    { title: 'Usuários CMS', path: '/user/all_users' },
                    { title: 'Usuários Blog', path: '/user/users_blog' },
                    { title: 'Adicionar Novo Usuário', path: '/user/add_user' },
                    { title: 'Editar perfil', path: '/user/profile' }
                ]
            },
            {
                title: 'Contatos',
                name: 'contacts',
                items: [
                    { title: 'Todos os contatos', path: '/contacts_form/all_contacts' }
                ]
            },
            {
                title: 'Newsletter',
                name: 'newsletter',
                items: [
                    { title: 'Gerenciar assinantes', path: '/newsletter' }
                ]
            },
            {
                title: 'Categorias',
                name: 'categories',
                items: [
                    { title: 'Todas as categorias', path: '/categories/all_categories' },
                    { title: 'Adicionar nova categoria', path: '/categories/add_category' },
                    { title: 'Adicionar nova categoria', path: '/categories/add_category_mobile' }
                ]
            },
            {
                title: 'Tags',
                name: 'tags',
                items: [
                    { title: 'Todas as tags', path: '/tags/all_tags' },
                    { title: 'Adicionar nova tag', path: '/tags/add_tag' }
                ]
            },
            {
                title: 'Artigos',
                name: 'posts',
                items: [
                    { title: 'Todos os posts', path: '/posts/all_posts' },
                    { title: 'Adicionar novo post', path: '/posts/add_post' }
                ]
            },
            {
                title: 'Marketing',
                name: 'marketing_publication',
                items: [
                    { title: 'Todas publicidades', path: '/marketing_publication/all_marketing_publication' },
                    { title: 'Adicionar publicidade', path: '/marketing_publication/add_marketing_publication' },
                    { title: 'Configurar intervalos', path: '/marketing_publication/config_interval_banner' }
                ]
            }
        ],
        EMPLOYEE: [
            {
                title: 'Perfil',
                name: 'profile',
                items: [
                    { title: 'Editar perfil', path: '/user/profile' }
                ]
            },
            {
                title: 'Categorias',
                name: 'categories',
                items: [
                    { title: 'Todas as categorias', path: '/categories/all_categories' }
                ]
            },
            {
                title: 'Artigos',
                name: 'posts',
                items: [
                    { title: 'Todos os posts', path: '/posts/all_posts' },
                    { title: 'Adicionar novo post', path: '/posts/add_post' }
                ]
            }
        ]
    };

    const renderMenu = (role: keyof typeof menuItems) => (
        menuItems[role].map((menu) => {
            // Filtra as rotas específicas do menu "Categorias"
            const filteredItems = menu.name === 'categories' 
                ? menu.items.filter(item => {
                    if (item.path === '/categories/add_category') return !isMobile;
                    if (item.path === '/categories/add_category_mobile') return isMobile;
                    return true; // Mantém outros itens
                  })
                : menu.items;
    
            return (
                <CollapsibleMenu
                    key={menu.name}
                    title={menu.title}
                    items={filteredItems}
                    openMenu={openMenu}
                    currentRoute={currentRoute}
                    menuName={menu.name}
                    onMenuToggle={handleMenuToggle}
                />
            );
        })
    );

    return (
        <Collapsible.Root
            defaultOpen
            className="h-screen w-screen bg-gray-950 text-slate-100 flex overflow-hidden"
            onOpenChange={setIsSideBarOpen}
        >
            {/* Sidebar */}
            <Collapsible.Content className="bg-gray-950 flex-shrink-0 border-r border-slate-600 h-full relative group overflow-y-auto">
                <Collapsible.Trigger className="absolute h-7 right-4 z-[99] text-white hover:scale-105 duration-200 inline-flex items-center justify-center">
                    <ArrowBendDoubleUpLeft className="h-7 w-7 mt-8" />
                </Collapsible.Trigger>

                <div className="flex-1 flex flex-col h-full gap-8 w-[220px]">
                    <nav className="flex mx-2 flex-col gap-8 text-slate-100">
                        <div className="flex flex-col gap-2 ml-2">
                            <div className="text-white font-semibold uppercase mb-2 ml-2 mt-3">
                                <Link href="/dashboard">
                                    <Image
                                        src={configs?.logo ? `${API_URL}/files/${configs.logo}` : noImage}
                                        width={120}
                                        height={120}
                                        alt="Logo do blog"
                                        priority
                                    />
                                </Link>
                            </div>
                        </div>

                        <section className="flex flex-col gap-px">
                            <Link href="/dashboard" className={clsx({
                                'bg-activeLink rounded p-2 mb-2': currentRoute === "/dashboard",
                                'text-white p-2 mb-2': currentRoute !== "/dashboard"
                            })}>
                                Dashboard
                            </Link>

                            {user?.role && renderMenu(user.role as keyof typeof menuItems)}
                        </section>
                    </nav>
                </div>
            </Collapsible.Content>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
                {/* Header */}
                <div className="flex items-center gap-4 leading-tight relative border-b border-slate-600 transition-all duration-200 py-[1.125rem] px-6 justify-between">
                    <div className="flex items-center gap-4">
                        <Collapsible.Trigger
                            className={clsx('h-7 w-7 text-gray-800 bg-gray-100 p-1 rounded-full relative z-[99]', {
                                hidden: isSideBarOpen,
                                block: !isSideBarOpen
                            })}
                        >
                            <CaretRight className="w-5 h-5" />
                        </Collapsible.Trigger>

                        <h1 className="text-white font-bold">CMS Blog - {configs?.name_blog}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-white hover:underline"
                        >
                            Ir para o blog
                        </Link>

                        <div className="flex items-center gap-4">
                            <span className="text-white">{user?.name}</span>

                            <NotificationDropdown
                                notifications={notifications}
                                hasUnread={hasUnread}
                                onMarkAsRead={markAsRead}
                                onMarkAllAsRead={markAllAsRead}
                            />

                            <UserAvatar user={user} API_URL={API_URL || ''} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar">
                    {children}
                </div>
            </div>
        </Collapsible.Root>
    );
}