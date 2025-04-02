import express from 'express'
import cors from 'cors'
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import { connectToDB } from './DB/DB.js'
import { addAppointmentCommentary, addNewAppointment, checkIfClientExistsAndModifyAppointments, getAppointmentByID, getAppointments, getAppointmentsOnBlockedDates, getApptsByClientID, getScheduledTimesByDate, removeAppointment, rescheduleAppointment } from './Controllers/AppointmentController.js'
import { startBot } from './TG/index.js'
import { addClientCommentary, addNewClient, editClientField, getClients } from './Controllers/ClientConntroller.js'
import { blockWeekends, getBlockedDates, setBlockedDates, unblockDates } from './Controllers/Dates.js'
import { addUser, changePassword, getUserByID, getUsers, handleSendResetPasswordLink, userLogin } from './Controllers/UserController.js'
import { checkClientToken } from './Utils/Auth/checkClientToken.js'
import { checkCreateUserToken } from './Utils/Auth/checkCreateUserToken.js'

const app = express()

app.use(cors())
app.use(express.json())

await connectToDB();
startBot()

app.post('/appointment/add', addNewAppointment)
app.get('/appointments/get', getAppointments)
app.get(`/appointment/get-by-id/:id`, getAppointmentByID)
app.post('/appointment/get-taken-times', getScheduledTimesByDate)
app.patch('/appointment/add-comment', addAppointmentCommentary)
app.patch('/appointment/reschedule', rescheduleAppointment)
app.delete('/appointment/remove/:apptID', removeAppointment)
app.get('/appointment/get-appointments-warning', getAppointmentsOnBlockedDates)
app.post('/appointment/add-id-if-name-exists', checkIfClientExistsAndModifyAppointments)
app.get('/appointment/get-by-client-id/:clientID', getApptsByClientID)

app.post('/client/add', addNewClient)
app.get('/clients/get', getClients)
app.patch('/client/add-comment', addClientCommentary)
app.patch('/client/edit-one-field', editClientField)

app.post('/dates/block-weekends', blockWeekends)
app.get('/dates/get-blocked-dates', getBlockedDates)
app.post('/dates/block-dates', setBlockedDates)
app.post('/dates/unblock-dates', unblockDates)

app.get('/user/get-all-users', getUsers)
app.get('/user/get-by-id/:id', getUserByID)
app.post('/user/add', addUser)
app.post('/user/login', userLogin)
app.patch('/user/change-password', changePassword)
app.post('/user/send-reset-password-link', handleSendResetPasswordLink)

app.post('/token/client/check', checkClientToken)
app.post('/token/create-user/check', checkCreateUserToken)

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ errorMessage: err.message || 'Internal Server Error', data: null });
});

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log('Server down')
    } else {
        console.log('Server works!')
    }
})