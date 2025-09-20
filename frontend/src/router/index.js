import { createRouter, createWebHistory } from 'vue-router'

// Import views/pages
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Cart from '../views/Cart.vue'
import Offers from '../views/Offers.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Inicio - Products'
        }
    },
    {
        path: '/categorias',
        name: 'Categories',
        component: Categories,
        meta: {
            title: 'Categorías - Products'
        }
    },
    {
        path: '/categoria/:categorySlug',
        name: 'CategoryProducts',
        component: Products,
        props: true,
        meta: {
            title: 'Productos - Products'
        }
    },
    {
        path: '/productos',
        name: 'Products',
        component: Products,
        meta: {
            title: 'Todos los Productos - Products'
        }
    },
    {
        path: '/producto/:productSlug',
        name: 'ProductDetail',
        component: ProductDetail,
        props: true,
        meta: {
            title: 'Producto - Products'
        }
    },
    {
        path: '/ofertas',
        name: 'Offers',
        component: Offers,
        meta: {
            title: 'Ofertas - Products'
        }
    },
    {
        path: '/carrito',
        name: 'Cart',
        component: Cart,
        meta: {
            title: 'Carrito - Products'
        }
    },
    {
        path: '/nosotros',
        name: 'About',
        component: About,
        meta: {
            title: 'Nosotros - Products'
        }
    },
    {
        path: '/contacto',
        name: 'Contact',
        component: Contact,
        meta: {
            title: 'Contacto - Products'
        }
    },
    {
        path: '/buscar',
        name: 'Search',
        component: () => import('../views/Search.vue'), // Lazy loading
        meta: {
            title: 'Buscar - Products'
        }
    },
    // Redirect para URLs no encontradas
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: {
            title: 'Página no encontrada - Products'
        }
    }
]

const router = createRouter({
    history: createWebHistory('/CeramicasCentral/'), // Configurar la base URL
    routes,
    // Scroll behavior para mejorar UX
    scrollBehavior(to, from, savedPosition) {
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
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Products - Construcción'
    next()
})

export default router