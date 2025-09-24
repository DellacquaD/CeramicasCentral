<template>
  <footer class="bg-gray-900 text-white">
    <!-- Main footer content -->
    <div class="max-w-7xl mx-auto px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Company info -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <img src="../assets/icono.png">
            </div>
            <div>
              <span class="text-2xl font-bold">Cerámicas</span>
              <div class="text-gray-400 text-sm uppercase tracking-wide">Central</div>
            </div>
          </div>

          <p class="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg">
            Somos líderes en materiales de construcción con más de 15 años de experiencia.
            Ofrecemos productos de primera calidad para todos tus proyectos.
          </p>

          <!-- Contact info -->
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <MapPinIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-gray-300">Av. Principal 1234, Montevideo, Uruguay</span>
            </div>
            <div class="flex items-center space-x-3">
              <PhoneIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-gray-300">+598 2xxx xxxx</span>
            </div>
            <div class="flex items-center space-x-3">
              <EnvelopeIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-gray-300">info@products.com.uy</span>
            </div>
            <div class="flex items-center space-x-3">
              <ClockIcon class="w-5 h-5 text-blue-400 flex-shrink-0" />
              <span class="text-gray-300">Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 13:00</span>
            </div>
          </div>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-xl font-semibold mb-6 text-white">Enlaces Rápidos</h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.name">
              <a
                  :href="link.href"
                  @click.prevent="$emit('navigate', link.path)"
                  class="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
              >
                <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>{{ link.name }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-xl font-semibold mb-6 text-white">Categorías</h3>
          <ul class="space-y-3">
            <li v-for="category in footerCategories" :key="category.name">
              <a
                  :href="category.href"
                  @click.prevent="$emit('selectCategory', category)"
                  class="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
              >
                <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>{{ category.name }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter subscription -->
      <div class="mt-16 pt-12 border-t border-gray-700">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-2xl font-bold mb-3">¿Quieres recibir ofertas exclusivas?</h3>
            <p class="text-gray-300">Suscríbete a nuestro newsletter y mantente informado sobre nuestros productos y promociones.</p>
          </div>

          <div class="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
            <input
                v-model="newsletterEmail"
                type="email"
                placeholder="tu@email.com"
                class="flex-1 px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
                @click="subscribeNewsletter"
                :disabled="!newsletterEmail"
                class="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap"
            >
              Suscribirme
            </button>
          </div>
        </div>
      </div>

      <!-- Social media and payment methods -->
      <div class="mt-12 pt-8 border-t border-gray-700">
        <div class="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <!-- Social media -->
          <div class="flex items-center space-x-6">
            <span class="text-gray-400 font-medium">Síguenos:</span>
            <div class="flex space-x-4">
              <a
                  v-for="social in socialLinks"
                  :key="social.name"
                  :href="social.href"
                  target="_blank"
                  :title="social.name"
                  class="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <span class="text-sm font-bold">{{ social.name.charAt(0) }}</span>
              </a>
            </div>
          </div>

          <!-- Payment methods -->
          <div class="flex items-center space-x-6">
            <span class="text-gray-400 font-medium">Aceptamos:</span>
            <div class="flex space-x-3">
              <div
                  v-for="payment in paymentMethods"
                  :key="payment.name"
                  class="w-12 h-8 bg-white rounded flex items-center justify-center p-1"
              >
                <span class="text-xs font-bold text-gray-700">{{ payment.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-gray-800 border-t border-gray-700">
      <div class="max-w-7xl mx-auto px-8 py-6">
        <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div class="flex items-center space-x-6">
            <p class="text-gray-400">
              © 2024 Products. Todos los derechos reservados.
            </p>
            <span class="text-gray-600">|</span>
            <span class="text-gray-400 text-sm">RUT: 12.345.678-0001</span>
          </div>

          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </a>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Devoluciones
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Props
defineProps({
  currency: {
    type: String,
    default: 'UYU'
  }
})

// Emits
const emit = defineEmits(['navigate', 'selectCategory', 'setCurrency'])

// Local state
const newsletterEmail = ref('')

// Data
const quickLinks = ref([
  { name: 'Inicio', path: '/', href: '#' },
  { name: 'Sobre Nosotros', path: '/about', href: '#' },
  { name: 'Catálogo', path: '/catalog', href: '#' },
  { name: 'Ofertas', path: '/offers', href: '#' },
  { name: 'Contacto', path: '/contact', href: '#' },
  { name: 'Blog', path: '/blog', href: '#' }
])

const footerCategories = ref([
  { name: 'Cerámicas', path: '/ceramicas' },
  { name: 'Griferías', path: '/griferias' },
  { name: 'Porcelanatos', path: '/porcelanatos' },
  { name: 'Loza Sanitaria', path: '/loza-sanitaria' },
  { name: 'Revestimientos', path: '/revestimientos' },
  { name: 'Ver todas', path: '/categorias' }
])

const socialLinks = ref([
  { name: 'Facebook', href: 'https://facebook.com' },
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'WhatsApp', href: 'https://wa.me/598xxxxxxx' }
])

const paymentMethods = ref([
  { name: 'VISA' },
  { name: 'MC' },
  { name: 'OCA' },
  { name: 'ANDA' }
])

// Methods
const subscribeNewsletter = () => {
  if (newsletterEmail.value) {
    console.log('Subscribing:', newsletterEmail.value)
    newsletterEmail.value = ''
  }
}
</script>