import React, { useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Category } from "../../../../../Types/types";

interface CategoryTreeProps {
    categories: Category[];
    moveCategory: (draggedId: string, targetId: string | null) => void;
    level?: number;
    moveUpCategory: (categoryId: string) => void;
    moveDownCategory: (categoryId: string) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, moveCategory, moveUpCategory, moveDownCategory, level = 0 }) => {
    return (
        <ul className={`space-y-3 ${level === 0 ? "ml-0" : "ml-6"}`}>
            {categories.map((category, index) => (
                <CategoryItem
                    key={category.id}
                    category={category}
                    moveCategory={moveCategory}
                    level={level}
                    moveUpCategory={moveUpCategory}
                    moveDownCategory={moveDownCategory}
                    isFirst={index === 0}
                    isLast={index === categories.length - 1}
                />
            ))}
        </ul>
    );
};

interface CategoryItemProps {
    category: Category;
    moveCategory: (draggedId: string, targetId: string | null) => void;
    moveUpCategory: (categoryId: string) => void;
    moveDownCategory: (categoryId: string) => void;
    level: number;
    isFirst: boolean;
    isLast: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, moveCategory, moveUpCategory, moveDownCategory, level, isFirst, isLast }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "category",
        item: {
            id: category.id,
            currentParent: category.parentId,
            category: category // Envia a categoria completa
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: "category",
        drop: (draggedItem: { id: string, category: Category }) => {
            if (canDrop) {
                moveCategory(draggedItem.id, category.id);
            }
        },
        canDrop: (draggedItem) => {
            // Verifica se o alvo não é descendente do item arrastado
            return !isDescendant(draggedItem.category, category.id) &&
                draggedItem.id !== category.id;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const isDescendant = (parent: Category, childId: string): boolean => {
        if (!parent.children) return false;
        return parent.children.some(child =>
            child.id === childId || isDescendant(child, childId)
        );
    };

    const ref = useCallback(
        (node: HTMLLIElement) => {
            drag(drop(node));
        },
        [drag, drop]
    );

    return (
        <li
            ref={ref}
            className={`space-y-2 relative
                ${isDragging ? "opacity-50" : "opacity-100"}
                ${isOver && canDrop ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                ${isOver && !canDrop ? "ring-2 ring-red-500 bg-red-50" : ""}`}
            style={{
                cursor: 'move',
                transition: 'all 0.2s ease',
                marginLeft: `${level * 1.5}rem`
            }}
        >
            <div className="flex items-center space-x-2">
                <div
                    className={`flex-1 p-4 rounded-md shadow-md transition-transform ${level === 0 ? "bg-blue-600 text-white" :
                            level === 1 ? "bg-green-600 text-white" :
                                level === 2 ? "bg-yellow-600 text-white" :
                                    level === 3 ? "bg-purple-600 text-white" :
                                        "bg-gray-600 text-white"
                        } ${isOver && canDrop ? "scale-[1.02]" : ""}`}
                >
                    <span className="font-semibold text-lg">
                        {category.name_category}
                    </span>

                    {isOver && canDrop && (
                        <div className="absolute inset-0 border-2 border-dashed border-white opacity-50 rounded-md" />
                    )}
                    {isOver && !canDrop && (
                        <div className="absolute inset-0 border-2 border-dashed border-red-500 rounded-md" />
                    )}
                </div>

                <div className="flex flex-col items-center space-y-1">
                    {!isFirst && (
                        <button
                            onClick={() => moveUpCategory(category.id)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30"
                            aria-label="Mover para cima"
                        >
                            ▲
                        </button>
                    )}
                    {!isLast && (
                        <button
                            onClick={() => moveDownCategory(category.id)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30"
                            aria-label="Mover para baixo"
                        >
                            ▼
                        </button>
                    )}
                </div>
            </div>

            {(category.children ?? []).length > 0 && (
                <ul className="ml-6 border-l-2 pl-4 border-white/20">
                    {(category.children ?? []).map((childCategory, index) => (
                        <CategoryItem
                            key={childCategory.id}
                            category={childCategory}
                            moveCategory={moveCategory}
                            moveUpCategory={moveUpCategory}
                            moveDownCategory={moveDownCategory}
                            level={level + 1}
                            isFirst={index === 0}
                            isLast={index === (category.children ?? []).length - 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default CategoryTree;