export const defaultThemeColors: Record<string, string> = {
    primaryColor: '#ffffff',
    secondaryColor: '#000000',
    thirdColor: '#ef4444',
    fourthColor: "#797a7b",
    fifthColor: "#1f2937",
    sixthColor: "#f97316",
    primarybackgroundColor: '#000000',
    secondarybackgroundColor: '#f9fafb',
    thirdbackgroundColor: '#f3f4f6',
    fourthbackgroundColor: '#6b7280'
};

// Função auxiliar para obter cores padrão
export const getDefaultColor = (colorName: string): string => {
    return defaultThemeColors[colorName] || '#ffffff';
};