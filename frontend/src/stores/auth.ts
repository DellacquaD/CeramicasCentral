import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
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

            // Manejar error de autenticación
            if (authError) {
                error.value = authError.message
                return false
            }

            // Verificar si es admin
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .single()

            // Validar que el usuario sea admin
            if (adminError || !adminData) {
                error.value = 'Usuario no autorizado como administrador'
                await supabase.auth.signOut()
                return false
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

    const logout = async () => {
        await supabase.auth.signOut()
        user.value = null
        localStorage.removeItem('admin_session')
    }

    const checkSession = async (): Promise<boolean> => {
        try {
            const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser()

            if (sessionError || !sessionUser) {
                return false
            }

            user.value = sessionUser
            return true
        } catch {
            return false
        }
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