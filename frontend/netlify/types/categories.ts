export interface SubCategory {
  id: number;
  nombre: string;
  descripcion: string;
  valores?: string[];
}

export interface Category {
  nombre: string;
  subcategoria: SubCategory[];
}

export interface CategoriesData {
  categorias: Record<string, Category>;
}

export interface ApiResponse {
  categorias?: Record<string, Category>;
  lastUpdate?: string | null;
  timestamp: string;
  success?: boolean;
  error?: string;
}