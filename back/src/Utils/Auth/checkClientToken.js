import jwt from 'jsonwebtoken'
import User from '../../DB/Models/User.js'

export const checkClientToken = async (req, res) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            res.status(401).json({ isAuthOK: false })
        }        
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY)        
        const user = await User.findById(req.body.userID)
        if (decodedToken.id == user._id) {
            res.json({ isAuthOK: true })
        } else {
            res.json({ isAuthOK: false })
        }
    } catch (err) {
        console.log(err)
        res.json({ isAuthOK: false })
    }
}