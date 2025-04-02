import axios from "../../axios"

export const clientModule = {
    state: () => ({
        clients: [],
        users: [],
        userByID: null,
        clientID: null,
        userID: null
    }),
    getters: {
        getClientByID(state) {
            return state.clients.find(client => client._id === state.clientID)
        },
        getClientByUserID(state) {
            return state.userID ? {...state.clients.filter(client => client.userID == state.userID)[0]} : null
        }
    },
    mutations: {
        setClients(state, clients) {
            state.clients = clients
        },
        setUsers(state, users) {
            state.users = users
        },
        setUserByID(state, userByID) {
            state.userByID = userByID
        },
        setClientID(state, id) {
            state.clientID = id
        },
        setUserID(state, userID) {
            state.userID = userID
        }
    },
    actions: {
        async getClients({ commit }) {
            const data = await axios.get('/clients/get')
            console.log(data.data)
            commit('setClients', data.data)
        },
        async getUsers({ commit }) {
            const data = await axios.get('/user/get-all-users')
            console.log(data.data)
            commit('setUsers', data.data)
        },
        async getOneUser({ commit }, id) {
            const data = await axios.get(`/user/get-by-id/${id}`)
            console.log(data.data)
            commit('setUserByID', data.data)
        }
    },
    namespaced: true
}