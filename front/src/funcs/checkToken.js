import axios from "../../axios.js"

export const checkToken = async () => {
    if (localStorage.getItem('tvPlanUserID') && localStorage.getItem('tvPlanToken')) {
        const accessCheck = await axios.post('/token/client/check', {
            userID: localStorage.getItem('tvPlanUserID')
        })
        console.log(accessCheck)
        console.log(`Router check ${accessCheck.data.isAuthOK}`)
        return accessCheck.data.isAuthOK
    } else {
        console.log('Check false')
        return false
    }
}