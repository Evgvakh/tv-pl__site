import jwt from 'jsonwebtoken'
import User from '../../DB/Models/User.js'

export const checkCreateUserToken = async (req, res) => {
    try {
        console.log(req.body.token, req.body.id)
        const token = req.headers.authorization
        if (!token) {
            res.status(401).json({ isAuthOK: false })
        }        
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY)        
        const user = await User.findById(req.body.id)
        if (!user) {
            res.status(401).json({ isAuthOK: false })
        }
        if (decodedToken.email == user.email) {
            res.json({ isAuthOK: true })
        } else {
            res.json({ isAuthOK: false })
        }
    } catch (err) {
        console.log(err)
        res.json({ isAuthOK: false })
    }
}