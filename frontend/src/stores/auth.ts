import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const login = async (email: string, password: string): Promise<boolean> => {
        loading.value = true
        error.value = null

        try {
            // Usar Supabase Auth real
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (authError) throw authError

            // Verificar si es admin
            const { data: adminData } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .single()

            if (!adminData) {
                throw new Error('Usuario no autorizado')
            }

            user.value = data.user
            return true
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error de autenticación'
            return false
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem('admin_session')
    }

    const checkSession = () => {
        const session = localStorage.getItem('admin_session')
        if (session) {
            try {
                user.value = JSON.parse(session)
                return true
            } catch {
                localStorage.removeItem('admin_session')
                return false
            }
        }
        return false
    }

    const isAuthenticated = (): boolean => {
        return user.value !== null
    }

    return {
        user,
        loading,
        error,
        login,
        logout,
        checkSession,
        isAuthenticated
    }
})