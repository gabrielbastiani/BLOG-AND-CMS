import dynamic from 'next/dynamic';
import { useState, ChangeEvent, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { setupAPIClientBlog } from "@/services/api_blog";
import { Input } from "@/app/components/input";
import { FiUpload } from "react-icons/fi";
import { AuthContextBlog } from "@/contexts/AuthContextBlog";
const CognitiveChallenge = dynamic(
    () => import('../../../cognitiveChallenge/index').then(mod => mod.CognitiveChallenge),
    {
        ssr: false,
        loading: () => (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                Carregando desafio de segurança...
            </div>
        )
    }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Insira um email válido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

interface ModalCreateUserProps {
    onClose: () => void;
    loginModal: () => void;
}

export const ModalCreateUser: React.FC<ModalCreateUserProps> = ({ onClose, loginModal }) => {

    const [cognitiveValid, setCognitiveValid] = useState(false);
    const { user } = useContext(AuthContextBlog);
    const [avatarUrl, setAvatarUrl] = useState(
        user?.image_user ? `${API_URL}/files/${user.image_user}` : ""
    );
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onChangeCheckbox = () => {
        setIsChecked((prev) => !prev);
    };

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }

        const image = e.target.files[0];
        if (!image) {
            return;
        }

        if (image.type === "image/jpeg" || image.type === "image/png") {
            setPhoto(image);
            setAvatarUrl(URL.createObjectURL(image));
        }
    }

    async function onSubmitCreate(data: FormData) {
        try {
            if (!cognitiveValid) {
                toast.error('Complete o desafio de segurança antes de enviar');
                return;
            }

            setLoading(true);

            const apiClientBlog = setupAPIClientBlog();
            const formData = new FormData();

            if (photo) {
                formData.append("file", photo);
            }

            formData.append("name", data.name || "");
            formData.append("email", data.email || "");
            formData.append("password", data.password || "");/* @ts-ignore */
            formData.append("newsletter", isChecked);

            await apiClientBlog.post("/user/user_blog/create", formData);

            toast.success("Usuario cadastrado com sucesso");

            setPhoto(null);

            onClose();

            loginModal();

        } catch (error) {
            console.log(error)
            toast.error("Erro ao cadastrar!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-3 text-black">Cadastrar</h2>
                <div className="flex justify-end mt-4 space-x-2">
                    <form
                        onSubmit={handleSubmit(onSubmitCreate)}
                        className="flex flex-col space-y-6 w-full max-w-md md:max-w-none"
                    >
                        <label className="relative w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full cursor-pointer flex justify-center bg-gray-200 overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity duration-300 rounded-full">
                                <FiUpload size={30} color="#ff6700" />
                            </span>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFile}
                                className="hidden"
                                alt="Foto do usuário"
                            />
                            {avatarUrl ? (
                                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    <Image
                                        className="object-cover w-full h-full rounded-full"
                                        src={avatarUrl}
                                        width={180}
                                        height={180}
                                        alt="Foto do usuário"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                    <FiUpload size={30} color="#ff6700" />
                                </div>
                            )}
                        </label>

                        <Input
                            styles="border-2 rounded-md h-12 px-3 w-full"
                            type="text"
                            placeholder="Digite seu nome completo..."
                            name="name"
                            error={errors.name?.message}
                            register={register}
                        />

                        <Input
                            styles="border-2 rounded-md h-12 px-3 w-full"
                            type="email"
                            placeholder="Digite seu email..."
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />

                        <Input
                            styles="border-2 rounded-md h-12 px-3 w-full"
                            type="text"
                            placeholder="Digite sua senha..."
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />

                        <label className="flex items-center text-black">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={onChangeCheckbox}
                                className="mr-2 min-h-8 min-w-7"
                            />
                            Quer receber as novidades em seu e-mail?
                        </label>

                        <CognitiveChallenge
                            onValidate={(isValid) => setCognitiveValid(isValid)}
                        />

                        <button
                            type='submit'
                            className={`bg-red-600 w-full rounded-md text-[#FFFFFF] h-10 font-medium ${!cognitiveValid ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={!cognitiveValid || loading}
                        >
                            {loading ? 'Carregando...' : 'Cadastrar'}
                        </button>

                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-[#FFFFFF] bg-gray-500 rounded-md w-56 cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};