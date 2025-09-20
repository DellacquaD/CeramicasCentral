<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Página no encontrada
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
      </div>

      <div class="space-y-4">
        <router-link
            to="/"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <HomeIcon class="w-5 h-5 mr-2" />
          Volver al Inicio
        </router-link>

        <div class="text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            ¿Buscas algo específico?
          </p>
          <div class="flex flex-col sm:flex-row gap-2 justify-center">
            <router-link
                to="/categorias"
                class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver Categorías
            </router-link>
            <router-link
                to="/productos"
                class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver Productos
            </router-link>
            <router-link
                to="/contacto"
                class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Contactanos
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HomeIcon } from '@heroicons/vue/24/outline'
</script>