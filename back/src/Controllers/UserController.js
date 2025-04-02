import User from "../DB/Models/User.js";
import generatePassword from 'generate-password'
import bcrypt from 'bcrypt'
import { sendCreateAccountMail, sendResetPasswordLink } from "../Utils/Mailers/mailer.js";
import generateToken from "../Utils/Auth/generateToken.js";
import jwt from 'jsonwebtoken'

export const addUser = async (req, res) => {
    try {
        let { email, password, role, url } = req.body
        let resetLink, hashPassword, token = null
        if (!password) {            
            token = jwt.sign(
                { email: email },
                process.env.SECRET_TOKEN_KEY,
                { expiresIn: '24h' }
            )            
        } 

        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password + process.env.PEPPER, salt);
        }

        const user = await User.create({
            email,
            password: hashPassword || 'temp',
            role: role || 'user'
        })
        resetLink = `${url}/reset-password/${token}/${user._id}`
        const { password: userPassword, ...userData } = user.toObject();
        await sendCreateAccountMail(req, res, { email, resetLink })
        res.status(201).send({ userData, token })
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error('Wrong credentials/Неверноый логин или пароль')
        }
        const isValidPassword = await bcrypt.compare(password + process.env.PEPPER, user.password)
        if (!isValidPassword) {
            throw new Error('Wrong credentials/Неверноый логин или пароль')
        }
        const token = generateToken(user._id, user.role)
        res.status(200).send({ user: { id: user._id, role: user.role, email: user.email }, token: token })
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getUsers = async (req, res) => {
    try {
        const data = await User.find({}, { password: 0 })
        if (!data) {
            throw new Error('Server error')
        }
        
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getUserByID = async (req, res) => {
    try {
        const { id } = req.params
        const data = await User.findById(id, { password: 0 })
        if (!data) {
            throw new Error('Bad Route')
        }

        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { userID, password } = req.body
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password + process.env.PEPPER, salt);
        const data = await User.updateOne({ _id: userID }, { $set: { password: hashPassword } })
        if (data.matchedCount > 0) {
            res.status(201).send(data)
        } else {
            throw new Error('Server Error')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const handleSendResetPasswordLink = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new Error('No such user/Нет такого пользователя')
        }
        const token = generateToken(user._id, user.role)
        const resetLink = `${req.body.url}/reset-password/${token}/${user._id}`
        sendResetPasswordLink(req, res, resetLink, req.body.email)
        res.status(200).send({ message: 'Sent' })
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}
