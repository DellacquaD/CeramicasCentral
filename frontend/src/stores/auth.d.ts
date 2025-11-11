import type { User } from '@supabase/supabase-js';
export declare const useAuthStore: import("pinia").StoreDefinition<"auth", Pick<{
    user: import("vue").Ref<{
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null, User | {
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
    isAuthenticated: () => boolean;
}, "loading" | "error" | "user">, Pick<{
    user: import("vue").Ref<{
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null, User | {
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
    isAuthenticated: () => boolean;
}, never>, Pick<{
    user: import("vue").Ref<{
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null, User | {
        id: string;
        app_metadata: {
            [x: string]: any;
            provider?: string | undefined;
        };
        user_metadata: import("@supabase/supabase-js").UserMetadata;
        aud: string;
        confirmation_sent_at?: string | undefined;
        recovery_sent_at?: string | undefined;
        email_change_sent_at?: string | undefined;
        new_email?: string | undefined;
        new_phone?: string | undefined;
        invited_at?: string | undefined;
        action_link?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        created_at: string;
        confirmed_at?: string | undefined;
        email_confirmed_at?: string | undefined;
        phone_confirmed_at?: string | undefined;
        last_sign_in_at?: string | undefined;
        role?: string | undefined;
        updated_at?: string | undefined;
        identities?: {
            id: string;
            user_id: string;
            identity_data?: {
                [key: string]: any;
            } | undefined;
            identity_id: string;
            provider: string;
            created_at?: string | undefined;
            last_sign_in_at?: string | undefined;
            updated_at?: string | undefined;
        }[] | undefined;
        is_anonymous?: boolean | undefined;
        is_sso_user?: boolean | undefined;
        factors?: ({
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "verified";
            created_at: string;
            updated_at: string;
        } | {
            id: string;
            friendly_name?: string | undefined;
            factor_type: "phone" | "totp" | "webauthn";
            status: "unverified";
            created_at: string;
            updated_at: string;
        })[] | undefined;
        deleted_at?: string | undefined;
    } | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<boolean>;
    isAuthenticated: () => boolean;
}, "login" | "logout" | "checkSession" | "isAuthenticated">>;
