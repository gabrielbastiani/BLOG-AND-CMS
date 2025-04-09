import dynamic from 'next/dynamic'
import { ChangeEvent, useState, useEffect, useContext, useRef } from "react"
import Image from "next/image"
import { FiUpload } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { setupAPIClientBlog } from "@/services/api_blog"
import { AuthContextBlog } from "@/contexts/AuthContextBlog"
import { Input } from "@/app/components/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CognitiveChallenge = dynamic(
  () => import('../../../cognitiveChallenge/index').then(mod => mod.CognitiveChallenge),
  {
    ssr: false,
    loading: () => (
      <div className="mb-4 p-2 md:p-4 bg-gray-50 rounded-lg text-sm md:text-base">
        Carregando desafio de segurança...
      </div>
    )
  }
)

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email("Insira um email válido").optional(),
})

type FormData = z.infer<typeof schema>

interface ModalEditUserProps {
  onClose: () => void
}

export const ModalEditUser: React.FC<ModalEditUserProps> = ({ onClose }) => {
  const [cognitiveValid, setCognitiveValid] = useState(false)
  const { updateUser, signOut, user } = useContext(AuthContextBlog)
  const [avatarUrl, setAvatarUrl] = useState(
    user?.image_user ? `${API_URL}/files/${user.image_user}` : ""
  )
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
      })
      setAvatarUrl(user?.image_user ? `${API_URL}/files/${user.image_user}` : "")
    }
  }, [user, reset, API_URL])

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const image = e.target.files[0]
    if (image && (image.type === "image/jpeg" || image.type === "image/png")) {
      setPhoto(image)
      setAvatarUrl(URL.createObjectURL(image))
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      if (!cognitiveValid) {
        toast.error('Complete o desafio de segurança antes de enviar')
        return
      }

      setLoading(true)

      const apiClientBlog = setupAPIClientBlog()
      const formData = new FormData()

      if (!user) {
        toast.error("Usuário não encontrado!")
        return
      }

      if (photo) {
        formData.append("file", photo)
      }

      if (data.name !== user.name) {
        formData.append("name", data.name || "")
      }

      if (data.email !== user.email) {
        formData.append("email", data.email || "")
      }

      formData.append("user_id", user.id)

      const response = await apiClientBlog.put("/user/user_blog/update", formData)

      toast.success("Dados atualizados com sucesso!")

      setPhoto(null)
      updateUser({ image_user: response.data.image_user })
      onClose()
    } catch (error) {
      toast.error("Erro ao atualizar!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95%] md:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-3 text-black">Editar dados</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 md:space-y-6"
          >
            <div className="flex justify-center">
              <label className="relative w-24 h-24 md:w-32 md:h-32 rounded-full cursor-pointer flex justify-center bg-gray-200 overflow-hidden">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFile}
                  className="hidden"
                />
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Foto do usuário"
                    width={128}
                    height={128}
                    className="rounded-full object-cover w-full h-full"
                    sizes="(max-width: 640px) 96px, 128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <FiUpload size={24} color="#ff6700" className="md:w-6 md:h-6 w-5 h-5" />
                  </div>
                )}
              </label>
            </div>

            <Input
              styles="border-2 rounded-md h-10 md:h-12 px-3 w-full text-sm md:text-base"
              type="text"
              placeholder="Digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
            />

            <Input
              styles="border-2 rounded-md h-10 md:h-12 px-3 w-full text-sm md:text-base"
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />

            <div className="px-1 md:px-2">
              <CognitiveChallenge
                onValidate={(isValid) => setCognitiveValid(isValid)}
              />
            </div>

            <button
              type='submit'
              className={`bg-red-600 w-full rounded-md text-white h-9 md:h-10 font-medium text-sm md:text-base ${!cognitiveValid ? 'opacity-50 cursor-not-allowed' : ''
                } transition-opacity duration-200`}
              disabled={!cognitiveValid || loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              onClick={signOut}
              className="w-full py-2 md:py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300 text-sm md:text-base"
            >
              Sair
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 md:py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-300 text-sm md:text-base"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}