export const miscModule = {
    state: () => ({
        env: null
    }),
    getters: {
        
    },
    mutations: {
        setEnv(state, env) {
            state.env = env
        }
    },
    actions: {
        
    },
    namespaced: true
}