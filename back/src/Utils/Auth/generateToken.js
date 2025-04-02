import jwt from 'jsonwebtoken'

const generateToken = (id, role) => {
    const token = jwt.sign(
        {
            id: id,
            role: role,
        },
        process.env.SECRET_TOKEN_KEY,
        { expiresIn: '1h' }
    )
    return token
} 

export default generateToken