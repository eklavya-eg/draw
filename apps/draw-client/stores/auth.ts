import { Store } from '@tanstack/store'

type AuthStore = {
    token: string | null,
    user: string | null
}

export const AuthStore = new Store<AuthStore>({
    token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,
    user: typeof window !== "undefined" ? localStorage.getItem("user_id") : null
})