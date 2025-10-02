// ===========================================
// composables/useProductos.ts
// ===========================================

import { ref, computed } from 'vue';

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  precioAnterior: number;
  moneda: string;
  stock: number;
  unidad: string;
  disponible: boolean;
  color: string;
  material: string;
  medidas: string;
  metrosPorCaja: number;
  precioMetro: number;
  pei: string;
  imagenPrincipal: string;
  imagenesSecundarias: string;
  activo: boolean;
  destacado: boolean;
  nuevo: boolean;
  enOferta: boolean;
  slug: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export function useProducts() {
  const productos = ref<Producto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const ultimaActualizacion = ref<string | null>(null);
  const cacheInfo = ref<any>(null);

  const cargarProductos = async (forzarRecarga = false) => {
    try {
      loading.value = true;
      error.value = null;

      const url = forzarRecarga
        ? '/.netlify/functions/productos?refresh=true'
        : '/.netlify/functions/productos';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.warning) {
        console.warn('⚠️', data.warning);
      }

      productos.value = data.productos || [];
      ultimaActualizacion.value = data.ultimaActualizacion;
      cacheInfo.value = data.cacheInfo;

      console.log(`✅ ${data.total} productos cargados`);

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando productos';
      console.error('❌ Error:', err);
    } finally {
      loading.value = false;
    }
  };

  const productosDisponibles = computed(() =>
    productos.value.filter(p => p.disponible && p.activo && p.stock > 0)
  );

  const productosPorCategoria = computed(() => {
    const grupos: Record<string, Producto[]> = {};
    productos.value.forEach(p => {
      if (!grupos[p.categoria]) grupos[p.categoria] = [];
      grupos[p.categoria].push(p);
    });
    return grupos;
  });

  const productosDestacados = computed(() =>
    productos.value.filter(p => p.destacado && p.disponible)
  );

  const productosEnOferta = computed(() =>
    productos.value.filter(p => p.enOferta && p.disponible)
  );

  const productosNuevos = computed(() =>
    productos.value.filter(p => p.nuevo && p.disponible)
  );

  const buscarProductos = (termino: string) => {
    const term = termino.toLowerCase();
    return productos.value.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      p.marca.toLowerCase().includes(term) ||
      p.categoria.toLowerCase().includes(term)
    );
  };

  const obtenerProductoPorSlug = (slug: string) => {
    return productos.value.find(p => p.slug === slug);
  };

  const filtrarPorCategoria = (categoria: string) => {
    return productos.value.filter(p =>
      p.categoria === categoria && p.disponible && p.activo
    );
  };

  return {
    // State
    productos,
    loading,
    error,
    ultimaActualizacion,
    cacheInfo,

    // Computed
    productosDisponibles,
    productosPorCategoria,
    productosDestacados,
    productosEnOferta,
    productosNuevos,

    // Methods
    cargarProductos,
    buscarProductos,
    obtenerProductoPorSlug,
    filtrarPorCategoria
  };
}