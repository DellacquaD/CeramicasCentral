import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views/pages
import Categories from '../views/Categories.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Cart from '../views/Cart.vue'
import Offers from '../views/Offers.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminProducts from "@/views/admin/AdminProducts.vue";
import AdminBrands from '@/views/admin/AdminBrands.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'
import AdminColors from '@/views/admin/AdminColors.vue'
import AdminMaterials from '@/views/admin/AdminMaterials.vue'
import AdminTags from '@/views/admin/AdminTags.vue'
import Home from "@/views/Home.vue";
import UnderConstruction from "@/views/UnderConstruction.vue";

const routes: RouteRecordRaw[] = [
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: Home,
    //     meta: {
    //         title: 'Inicio - CerámicasCentral'
    //     }
    // },
    {
        path: '/',
        name: 'UnderConstruction',
        component: UnderConstruction,
        meta: {
            title: 'Inicio - CerámicasCentral'
        }
    },
    {
        path: '/categories',
        name: 'Categories',
        component: Categories,
        meta: {
            title: 'Categorías - CerámicasCentral'
        }
    },
    {
        path: '/categories/:slug',
        name: 'category-detail',
        component: Categories
    },
    {
        path: '/products',
        name: 'Products',
        component: Products,
        meta: {
            title: 'Todos los Productos - CerámicasCentral'
        }
    },
    {
        path: '/product/:productSlug',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true,
        meta: {
            title: 'Producto - CerámicasCentral'
        }
    },
    {
        path: '/offers',
        name: 'Offers',
        component: Offers,
        meta: {
            title: 'Ofertas - CerámicasCentral'
        }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: Cart,
        meta: {
            title: 'Carrito - CerámicasCentral'
        }
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
            title: 'Nosotros - CerámicasCentral'
        }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact,
        meta: {
            title: 'Contacto - CerámicasCentral'
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue'), // Lazy loading
        meta: {
            title: 'Buscar - CerámicasCentral'
        }
    },
    // Redirect para URLs no encontradas
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: {
            title: 'Página no encontrada - CerámicasCentral'
        }
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: { requiresAuth: false }
    },

    // Rutas del admin (requieren autenticación)
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: AdminDashboard
            },
            {
                path: 'products',
                name: 'AdminProducts',
                component: AdminProducts
            },
            {
                path: 'brands',
                name: 'AdminBrands',
                component: AdminBrands
            },
            {
                path: 'categories',
                name: 'AdminCategories',
                component: AdminCategories
            },
            {
                path: 'colors',
                name: 'AdminColors',
                component: AdminColors
            },
            {
                path: 'materials',
                name: 'AdminMaterials',
                component: AdminMaterials
            },
            {
                path: 'tags',
                name: 'AdminTags',
                component: AdminTags
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // Scroll behavior para mejorar UX
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth'
            }
        } else {
            return { top: 0, behavior: 'smooth' }
        }
    }
})

// Guards combinados
router.beforeEach((to, _from, next) => {
    // 1. Actualizar título de la página (tu guard original)
    document.title = (to.meta?.title as string) || 'CerámicasCentral - Construcción'

    // 2. Guard de autenticación para el admin (nuevo)
    const authStore = useAuthStore()

    // Verificar sesión al cargar la app
    if (!authStore.user) {
        authStore.checkSession()
    }

    // Si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
        if (authStore.isAuthenticated()) {
            next()
        } else {
            // Redirigir al login del admin guardando la ruta destino
            next({
                name: 'AdminLogin',
                query: { redirect: to.fullPath }
            })
        }
    }
    // Si ya está autenticado e intenta ir al login, redirigir al dashboard
    else if (to.name === 'AdminLogin' && authStore.isAuthenticated()) {
        next({ name: 'AdminDashboard' })
    }
    // Ruta pública, permitir acceso
    else {
        next()
    }
})

export default router