import axios from "../../axios.js";

export const checkParams = async (param) => {
    try {
        const data = await axios.get(`/user/get-by-id/${param}`)
        if (!data.errorMessage) {
            return true
        } else {return false}
    } catch (error) {
        return false
    }
}