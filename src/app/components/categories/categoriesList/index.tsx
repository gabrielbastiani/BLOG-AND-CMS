import { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { setupAPIClient } from "@/services/api";
import { Category } from "../../../../../Types/types";
import CategoryTree from "../categoryTree";
import { HTML5Backend } from "react-dnd-html5-backend";

let TouchBackend: any;
if (typeof window !== "undefined") {
  TouchBackend = require('react-dnd-touch-backend').default;
}

const RootDropArea = ({ moveCategory }: { moveCategory: (draggedId: string, targetId: null) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "category",
    drop: (draggedItem: { id: string }) => {
      moveCategory(draggedItem.id, null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={`mb-4 p-4 rounded-lg border-2 border-dashed text-center transition-all text-black
        ${isOver ? "bg-orange-100 border-orange-500 scale-105" : "bg-gray-100 border-gray-300"}`}
    >
      Arraste categorias aqui para torná-las raiz
    </div>
  );
};

const CategoriesList = ({ refetchCategories }: { refetchCategories: () => void }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const backend = isMounted && typeof window !== "undefined" &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    ? TouchBackend
    : HTML5Backend;

  const fetchCategories = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get('/category/cms');
      setCategories(response.data.rootCategories);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchCategories();
  }, []);

  const moveUpCategory = async (categoryId: string) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/category/moveUp", { categoryId });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao mover categoria para cima:", error);
    }
  };

  const moveDownCategory = async (categoryId: string) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/category/moveDown", { categoryId });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao mover categoria para baixo:", error);
    }
  };

  const moveCategory = async (draggedId: string, targetId: string | null) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/category/updateOrder", { draggedId, targetId });
      fetchCategories();
    } catch (error) {
      console.error("Erro ao mover categoria:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <DndProvider backend={backend} options={{ enableMouseEvents: true }}>
      <div className="mt-6 px-4">
        <RootDropArea moveCategory={moveCategory} />

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter(category => !category.parentId)
            .map(parentCategory => (
              <div key={parentCategory.id} className="p-4 rounded-lg shadow-lg bg-slate-400">
                <CategoryTree
                  key={parentCategory.id}
                  categories={[parentCategory]}
                  moveUpCategory={moveUpCategory}
                  moveDownCategory={moveDownCategory}
                  moveCategory={moveCategory}
                />
              </div>
            ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default CategoriesList;