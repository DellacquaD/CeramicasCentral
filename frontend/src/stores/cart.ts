import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interfaces
export interface Product {
    id: string | number
    nombre: string
    precio?: number
    precioMetro?: number
    metrosPorCaja?: number
    imagenPrincipal?: string
    marca?: string
    unidad?: string
    stock: number
}

export interface CartItem {
    id: string | number
    nombre: string
    precio: number
    precioMetro?: number
    metrosPorCaja?: number
    imagenPrincipal?: string
    marca: string
    unidad: string
    stock: number
    quantity: number
}

type NotificationType = 'success' | 'warning' | 'error'

export const useCartStore = defineStore('cart', () => {
    // State
    const items = ref<CartItem[]>([])

    // Getters
    const itemCount = computed((): number => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalPrice = computed((): number => {
        return items.value.reduce((total, item) => {
            return total + (item.precio * item.quantity)
        }, 0)
    })

    const isEmpty = computed((): boolean => items.value.length === 0)

    // Actions
    const addItem = (product: Product): void => {
        const existingItem = items.value.find(item => item.id === product.id)

        if (existingItem) {
            // Si ya existe, aumentar cantidad
            existingItem.quantity++
        } else {
            // Calcular precio
            const precio = product.precioMetro && product.metrosPorCaja
                ? parseInt((product.precioMetro * product.metrosPorCaja).toFixed(2))
                : product.precio || 0

            // Si no existe, agregarlo
            items.value.push({
                id: product.id,
                nombre: product.nombre,
                precio,
                precioMetro: product.precioMetro,
                metrosPorCaja: product.metrosPorCaja,
                imagenPrincipal: product.imagenPrincipal,
                marca: product.marca || 'Sin marca',
                unidad: product.unidad || 'caja',
                stock: product.stock,
                quantity: 1
            })
        }

        // Guardar en localStorage
        saveToLocalStorage()

        // Mostrar notificación
        showNotification(`${product.nombre} agregado al carrito`)
    }

    const removeItem = (productId: string | number): void => {
        const index = items.value.findIndex(item => item.id === productId)
        if (index > -1) {
            items.value.splice(index, 1)
            saveToLocalStorage()
        }
    }

    const updateQuantity = (productId: string | number, quantity: number): void => {
        const item = items.value.find(item => item.id === productId)

        if (item) {
            if (quantity <= 0) {
                removeItem(productId)
            } else {
                // Verificar que no exceda el stock
                if (quantity <= item.stock) {
                    item.quantity = quantity
                    saveToLocalStorage()
                } else {
                    showNotification(`Stock máximo disponible: ${item.stock}`, 'warning')
                }
            }
        }
    }

    const clearCart = (): void => {
        items.value = []
        saveToLocalStorage()
    }

    const saveToLocalStorage = (): void => {
        try {
            localStorage.setItem('cart', JSON.stringify(items.value))
        } catch (e) {
            console.error('Error al guardar el carrito:', e)
        }
    }

    const loadFromLocalStorage = (): void => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            try {
                items.value = JSON.parse(saved) as CartItem[]
            } catch (e) {
                console.error('Error al cargar el carrito:', e)
                items.value = []
            }
        }
    }

    const showNotification = (message: string, type: NotificationType = 'success'): void => {
        console.log(`[${type.toUpperCase()}] ${message}`)

        // Crear una notificación simple en la página
        const notification = document.createElement('div')
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'

        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${bgColor} text-white font-medium animate-slide-in`
        notification.textContent = message
        document.body.appendChild(notification)

        setTimeout(() => {
            notification.classList.add('animate-slide-out')
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 300)
        }, 3000)
    }

    const generateWhatsAppMessage = (): string => {
        if (items.value.length === 0) return ''

        let message = '🛒 *Hola! Quisiera hacer este pedido:*\n\n'

        items.value.forEach((item, index) => {
            const subtotal = item.precio * item.quantity
            message += `${index + 1}. *${item.nombre}*\n`
            message += `   Marca: ${item.marca}\n`
            message += `   Cantidad: ${item.quantity} ${item.unidad}\n`
            message += `   Subtotal: ${subtotal.toLocaleString('es-UY')}\n\n`
        })

        message += `💰 *TOTAL: ${totalPrice.value.toLocaleString('es-UY')}*\n\n`
        message += '¿Tienen disponibilidad?'

        return encodeURIComponent(message)
    }

    const checkout = (): void => {
        if (items.value.length === 0) {
            showNotification('El carrito está vacío', 'warning')
            return
        }

        const message = generateWhatsAppMessage()
        const phone = '59891926996' // Reemplaza con tu número (solo números, sin +)

        // Intentar diferentes métodos según el dispositivo
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

        if (isMobile) {
            // En móvil: intentar abrir la app directamente
            const appUrl = `whatsapp://send?phone=${phone}&text=${message}`
            window.location.href = appUrl
        } else {
            // En desktop: usar wa.me con formato correcto
            const url = `https://wa.me/${phone}?text=${message}`

            // Debug: ver el mensaje en consola
            console.log('Mensaje WhatsApp:', decodeURIComponent(message))
            console.log('URL completa:', url)

            window.open(url, '_blank')
        }
    }

    const getItemById = (productId: string | number): CartItem | undefined => {
        return items.value.find(item => item.id === productId)
    }

    const isInCart = (productId: string | number): boolean => {
        return items.value.some(item => item.id === productId)
    }

    const getItemQuantity = (productId: string | number): number => {
        const item = items.value.find(item => item.id === productId)
        return item ? item.quantity : 0
    }

    // Cargar el carrito al inicializar
    loadFromLocalStorage()

    return {
        // State
        items,

        // Getters
        itemCount,
        totalPrice,
        isEmpty,

        // Actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
        loadFromLocalStorage,
        getItemById,
        isInCart,
        getItemQuantity
    }
})