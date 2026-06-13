export const useAuthApi = () => {
    const { POST } = useApi()
    return {
        login: (data) => POST('/api/auth/login', data),
        register: (data) => POST('/api/auth/register', data)
    }
}