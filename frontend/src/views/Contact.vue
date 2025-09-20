<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contáctanos
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Estamos aquí para ayudarte con tu proyecto. No dudes en contactarnos.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact info -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Información de Contacto
            </h2>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <MapPinIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Dirección</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Av. Principal 1234<br>
                    Montevideo, Uruguay
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <PhoneIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Teléfono</h3>
                  <p class="text-gray-600 dark:text-gray-400">+598 2xxx xxxx</p>
                  <p class="text-gray-600 dark:text-gray-400">+598 9xxx xxxx</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <EnvelopeIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                  <p class="text-gray-600 dark:text-gray-400">info@products.com.uy</p>
                  <p class="text-gray-600 dark:text-gray-400">ventas@products.com.uy</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <ClockIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Horarios</h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    Lunes a Viernes: 8:00 - 18:00<br>
                    Sábados: 8:00 - 13:00<br>
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>

            <!-- WhatsApp button -->
            <div class="mt-8">
              <button
                  @click="openWhatsApp"
                  class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Chatear por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Contact form -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Envíanos un Mensaje
            </h2>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                      v-model="form.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+598 xxxx xxxx"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asunto
                  </label>
                  <select
                      v-model="form.subject"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar asunto</option>
                    <option value="cotizacion">Solicitar cotización</option>
                    <option value="consulta">Consulta técnica</option>
                    <option value="reclamo">Reclamo</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                    v-model="form.message"
                    required
                    rows="5"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe tu consulta o proyecto..."
                ></textarea>
              </div>

              <div class="flex items-center">
                <input
                    v-model="form.newsletter"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Deseo recibir ofertas y novedades por email
                </label>
              </div>

              <div class="flex justify-end">
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <span v-if="isSubmitting">Enviando...</span>
                  <span v-else>Enviar Mensaje</span>
                  <PaperAirplaneIcon class="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Respuestas a las consultas más comunes
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div class="space-y-4">
            <div
                v-for="faq in faqs"
                :key="faq.id"
                class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
            >
              <button
                  @click="faq.open = !faq.open"
                  class="w-full text-left flex items-center justify-between py-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span class="font-medium">{{ faq.question }}</span>
                <ChevronDownIcon
                    :class="[
                    'w-5 h-5 transition-transform',
                    faq.open ? 'rotate-180' : ''
                  ]"
                />
              </button>
              <div v-show="faq.open" class="mt-2 text-gray-600 dark:text-gray-400">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

// Form state
const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  newsletter: false
})

const isSubmitting = ref(false)

// FAQ data
const faqs = ref([
  {
    id: 1,
    question: '¿Hacen entregas a domicilio?',
    answer: 'Sí, realizamos entregas en Montevideo y área metropolitana. Para compras mayores a $5000 el envío es gratuito.',
    open: false
  },
  {
    id: 2,
    question: '¿Ofrecen servicio de instalación?',
    answer: 'Contamos con una red de instaladores certificados que pueden realizar el trabajo. El costo depende del tipo de producto y área a cubrir.',
    open: false
  },
  {
    id: 3,
    question: '¿Qué formas de pago aceptan?',
    answer: 'Aceptamos efectivo, transferencia bancaria, todas las tarjetas de crédito y débito. También ofrecemos financiación en cuotas sin interés.',
    open: false
  },
  {
    id: 4,
    question: '¿Tienen garantía los productos?',
    answer: 'Todos nuestros productos cuentan con garantía del fabricante. El período varía según el producto, desde 1 año hasta 25 años en algunos casos.',
    open: false
  },
  {
    id: 5,
    question: '¿Puedo ver muestras antes de comprar?',
    answer: 'Por supuesto. Te invitamos a visitar nuestro showroom donde podrás ver y tocar todos los productos. También llevamos muestras a domicilio.',
    open: false
  }
])

// Methods
const submitForm = async () => {
  isSubmitting.value = true

  try {
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Aquí integrarías con tu backend
    console.log('Form data:', form)

    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      newsletter: false
    })

    alert('Mensaje enviado correctamente. Te contactaremos pronto.')
  } catch (error) {
    alert('Error al enviar el mensaje. Inténtalo nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}

const openWhatsApp = () => {
  const phone = '598XXXXXXXX'
  const message = 'Hola! Me gustaría obtener más información sobre sus productos.'
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}
</script>