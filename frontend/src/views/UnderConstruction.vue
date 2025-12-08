<template>
  <div class="construction-container">
    <div class="construction-content">
      <div class="icon-container">
        <svg class="construction-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="gear gear-1">⚙️</div>
        <div class="gear gear-2">⚙️</div>
      </div>

      <h1 class="title">Sitio en Construcción</h1>
      <p class="subtitle">Estamos trabajando para traerte algo increíble</p>

      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>

      <p class="message">{{ message }}</p>

      <div v-if="showNotify" class="notify-form">
        <input
            v-model="email"
            type="email"
            placeholder="Tu correo electrónico"
            class="email-input"
        />
        <button @click="handleNotify" class="notify-button">
          Notificarme
        </button>
      </div>

      <p v-if="submitted" class="success-message">
        ¡Gracias! Te avisaremos cuando estemos listos.
      </p>
    </div>

    <div class="decorative-elements">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnderConstruction',

  props: {
    message: {
      type: String,
      default: 'Volvemos pronto con novedades'
    },
    showNotify: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      email: '',
      submitted: false
    }
  },

  methods: {
    handleNotify() {
      if (this.email && this.validateEmail(this.email)) {
        this.$emit('notify', this.email)
        this.submitted = true
        this.email = ''
      }
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>

<style scoped>
.construction-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.construction-content {
  text-align: center;
  padding: 2rem;
  z-index: 1;
}

.icon-container {
  position: relative;
  margin-bottom: 2rem;
}

.construction-icon {
  width: 80px;
  height: 80px;
  color: #e94560;
  animation: float 3s ease-in-out infinite;
}

.gear {
  position: absolute;
  font-size: 2rem;
  animation: spin 4s linear infinite;
}

.gear-1 {
  top: -10px;
  right: calc(50% - 80px);
}

.gear-2 {
  bottom: -10px;
  left: calc(50% - 80px);
  animation-direction: reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.title {
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 300px;
  max-width: 90%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 0 auto 2rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 65%;
  background: linear-gradient(90deg, #e94560, #ff6b6b);
  border-radius: 3px;
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0%, 100% { width: 45%; }
  50% { width: 75%; }
}

.message {
  color: #e0e0e0;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.notify-form {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.email-input {
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  width: 250px;
  max-width: 100%;
  transition: all 0.3s ease;
}

.email-input:focus {
  outline: none;
  border-color: #e94560;
  background: rgba(255, 255, 255, 0.1);
}

.email-input::placeholder {
  color: #808080;
}

.notify-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e94560, #ff6b6b);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notify-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
}

.success-message {
  color: #4ade80;
  font-size: 1rem;
  margin-top: 1rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.decorative-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(233, 69, 96, 0.1);
}

.dot-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: pulse 4s ease-in-out infinite;
}

.dot-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation: pulse 5s ease-in-out infinite;
}

.dot-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  animation: pulse 6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.2; }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .notify-form {
    flex-direction: column;
    align-items: center;
  }

  .email-input, .notify-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>