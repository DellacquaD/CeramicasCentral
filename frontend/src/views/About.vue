<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Sobre Nosotros
        </h1>
        <p class="text-xl text-blue-100 max-w-3xl mx-auto">
          Más de 15 años construyendo sueños con los mejores materiales de construcción en Uruguay
        </p>
      </div>
    </section>

    <!-- Story section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestra Historia
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Desde 2008, hemos sido pioneros en ofrecer materiales de construcción de la más alta calidad en Uruguay.
              Lo que comenzó como una pequeña empresa familiar se ha convertido en uno de los distribuidores más
              confiables del país.
            </p>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Nos especializamos en pisos vinílicos, porcelanatos, cerámicas y todo lo necesario para transformar
              espacios en hogares únicos. Nuestro compromiso es brindar no solo productos excepcionales, sino también
              el mejor servicio y asesoramiento profesional.
            </p>
            <div class="flex space-x-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">15+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Años</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">5000+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Clientes</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Productos</div>
              </div>
            </div>
          </div>
          <div>
            <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
                alt="Showroom de Products"
                class="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Values section -->
    <section class="bg-white dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestros Valores
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Los principios que guían nuestro trabajo y definen quiénes somos
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Calidad</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Seleccionamos cuidadosamente cada producto para garantizar la máxima calidad y durabilidad.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Compromiso</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Estamos comprometidos con el éxito de cada proyecto, desde la elección hasta la instalación.
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <LightBulbIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Innovación</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Constantemente incorporamos las últimas tendencias y tecnologías en construcción.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestro Equipo
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Profesionales especializados listos para ayudarte en tu proyecto
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in team" :key="member.id" class="text-center">
            <div class="relative mb-4">
              <img
                  :src="member.image"
                  :alt="member.name"
                  class="w-32 h-32 rounded-full mx-auto object-cover"
              />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {{ member.name }}
            </h3>
            <p class="text-blue-600 dark:text-blue-400 font-medium mb-2">
              {{ member.position }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ member.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Location section -->
    <section class="bg-white dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Visítanos
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Te invitamos a conocer nuestro showroom donde podrás ver y tocar todos nuestros productos.
              Nuestro equipo de especialistas te brindará asesoramiento personalizado para tu proyecto.
            </p>

            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <MapPinIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300">Av. Principal 1234, Montevideo, Uruguay</span>
              </div>
              <div class="flex items-center space-x-3">
                <ClockIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300">Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 13:00</span>
              </div>
              <div class="flex items-center space-x-3">
                <PhoneIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300">+598 2xxx xxxx</span>
              </div>
              <div class="flex items-center space-x-3">
                <EnvelopeIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span class="text-gray-700 dark:text-gray-300">info@products.com.uy</span>
              </div>
            </div>

            <div class="mt-8">
              <router-link
                  to="/contacto"
                  class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Contáctanos
                <ArrowRightIcon class="w-5 h-5 ml-2" />
              </router-link>
            </div>
          </div>

          <div>
            <div class="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80 flex items-center justify-center">
              <div class="text-center text-gray-500 dark:text-gray-400">
                <MapPinIcon class="w-12 h-12 mx-auto mb-4" />
                <p>Mapa interactivo</p>
                <p class="text-sm">(Integración con Google Maps)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">
          ¿Listo para comenzar tu proyecto?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Nuestro equipo está aquí para ayudarte a hacer realidad tu visión
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
              to="/contacto"
              class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Solicitar Cotización
          </router-link>
          <router-link
              to="/productos"
              class="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
          >
            Ver Productos
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ShieldCheckIcon,
  HeartIcon,
  LightBulbIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Team data
const team = ref([
  {
    id: 1,
    name: 'María González',
    position: 'Directora General',
    description: 'Lidera la empresa con más de 15 años de experiencia en el sector.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b865?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    position: 'Especialista en Pisos',
    description: 'Experto en instalación y selección de pisos vinílicos y porcelanatos.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    position: 'Diseñadora de Interiores',
    description: 'Ayuda a los clientes a elegir la combinación perfecta para sus espacios.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Juan López',
    position: 'Asesor Técnico',
    description: 'Brinda soporte técnico especializado en instalación y mantenimiento.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  }
])
</script>