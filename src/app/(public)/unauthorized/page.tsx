import Link from 'next/link';

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-6xl font-bold text-gray-800">Oops!</h1>
            <p className="text-xl mt-4 mb-10">Você não tem autorização para acessar está página.</p>
            <Link href="/dashboard" className="w-full md:w-80 px-6 py-3 bg-backgroundButton text-[#FFFFFF] rounded hover:bg-hoverButtonBackground transition duration-300">
                Voltar para página inicial
            </Link>
        </div>
    );
};