import axios from "../../axios"

export const planningModule = {
    state: () => ({
        datesToShow: [new Date().toISOString().split('T')[0], new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0]],
        blockedDates: null,
        appointments: null,
        apptsByClientID: null,
        clientSearchQueryID: '',
        times: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
        dateToCheck: null,
        apptsOnBlockedDates: null,
        apptByID: null
    }),
    getters: {
        getApptCommentsByClientID(state) {            
            let filteredArray = state.appointments.filter(appt => {
                return appt.clientID === state.clientSearchQueryID
            }).sort((a, b) => new Date(b.date) - new Date(a.date))
            const result = filteredArray.flatMap(appointment => 
                appointment.commentaries.map(commentary => ({
                  apptID: appointment._id,
                  commentary: commentary.text
                }))
              );
            return result
        }
    },
    mutations: {
        setDatesToShow(state, dates) {
            state.datesToShow = dates
        },
        setAppointments(state, appointments) {
            state.appointments = appointments
        },
        setClientSearchQueryID(state, id) {
            state.clientSearchQueryID = id
        },
        setDateToCheck(state, dateToCheck) {
            state.dateToCheck = dateToCheck
        },
        setBlockedDates(state, blockedDates) {
            state.blockedDates = blockedDates
        },
        setApptsOnBlockedDates(state, apptsOnBlockedDates) {
            state.apptsOnBlockedDates = apptsOnBlockedDates
        },
        setApptsByClientID(state, apptsByClientID) {
            state.apptsByClientID = apptsByClientID
        },
        setApptByID(state, apptByID) {
            state.apptByID = apptByID
        }
    },
    actions: {
        async getAppts({commit, state}) {
            const {data} = await axios.get('/appointments/get')
            commit('setAppointments', data)
            console.log(data)
        },
        async getBlockedDates({commit, state}) {
            const {data} = await axios.get('/dates/get-blocked-dates')
            commit('setBlockedDates', data)
            console.log(data)
        },
        async getApptsOnBlockedDates({commit}) {
            const {data} = await axios.get('/appointment/get-appointments-warning')
            commit('setApptsOnBlockedDates', data)
            console.log(data)
        },
        async getApptsByClientID({ commit }, id) {
            const { data } = await axios.get(`/appointment/get-by-client-id/${id}`)
            commit('setApptsByClientID', data)
            console.log(data)
        },
        async getApptByID({ commit }, id) {
            const { data } = await axios.get(`/appointment/get-by-id/${id}`)
            commit('setApptByID', data)
            console.log(data)
        }
    },
    namespaced: true
}