import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import views/pages
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Cart from '../views/Cart.vue'
import Offers from '../views/Offers.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Inicio - CerámicasCentral'
        }
    },
    {
        path: '/categorias',
        name: 'Categories',
        component: Categories,
        meta: {
            title: 'Categorías - CerámicasCentral'
        }
    },
    {
        path: '/categoria/:categorySlug',
        name: 'CategoryProducts',
        component: Products,
        props: true,
        meta: {
            title: 'Productos - CerámicasCentral'
        }
    },
    {
        path: '/productos',
        name: 'Products',
        component: Products,
        meta: {
            title: 'Todos los Productos - CerámicasCentral'
        }
    },
    {
        path: '/producto/:productSlug',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true,
        meta: {
            title: 'Producto - CerámicasCentral'
        }
    },
    {
        path: '/ofertas',
        name: 'Offers',
        component: Offers,
        meta: {
            title: 'Ofertas - CerámicasCentral'
        }
    },
    {
        path: '/carrito',
        name: 'Cart',
        component: Cart,
        meta: {
            title: 'Carrito - CerámicasCentral'
        }
    },
    {
        path: '/nosotros',
        name: 'About',
        component: About,
        meta: {
            title: 'Nosotros - CerámicasCentral'
        }
    },
    {
        path: '/contacto',
        name: 'Contact',
        component: Contact,
        meta: {
            title: 'Contacto - CerámicasCentral'
        }
    },
    {
        path: '/buscar',
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
    }
]

const router = createRouter({
    history: createWebHistory('/CeramicasCentral/'),
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

// Guard para actualizar el título de la página
router.beforeEach((to, _from, next) => {
    document.title = (to.meta?.title as string) || 'CerámicasCentral - Construcción'
    next()
})

export default router