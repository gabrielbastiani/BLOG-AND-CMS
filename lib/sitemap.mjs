import fetch from 'node-fetch';

async function fetchDynamicRoutes() {
    try {
        // 1. Busca posts da API
        const postsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article/sitemap`);
        if (!postsRes.ok) throw new Error(`Falha nos posts: ${postsRes.status}`);
        const posts = await postsRes.json();

        // 2. Busca categorias da API
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts_categories/sitemap`);
        if (!categoriesRes.ok) throw new Error(`Falha nas categorias: ${categoriesRes.status}`);
        const categories = await categoriesRes.json();

        // 3. Formata URLs
        return [
            ...posts.map(post => ({
                loc: `/article/${post.custom_url || post.slug_title_post}`,
                lastmod: post.updated_at,
                priority: 0.7
            })),
            ...categories.map(cat => ({
                loc: `/posts_categories/${cat.slug_name_category}`,
                lastmod: cat.updated_at,
                priority: 0.6
            }))
        ];

    } catch (error) {
        console.error('Erro ao buscar rotas:', error);
        return [];
    }
}

export default fetchDynamicRoutes;