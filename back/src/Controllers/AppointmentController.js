import Appointment from "../DB/Models/Appointment.js";
import BlockedDate from "../DB/Models/BlockedDate.js";
import { sendAddAppointmentMail, sendRescheduleAppointmentMail } from "../Utils/Mailers/mailer.js";
import { formatDateDDMMYY } from './../Utils/formatDateDDMMYYY.js';

export const addNewAppointment = async (req, res) => {
    try {        
        const { date, time, clientName, clientID, commentary, createdBy, isNotificationNeeded, recipientEmail, type, addedToApptID } = req.body
        
        const isExisitngAppointment = await Appointment.findOne({ date: date, time: time })        
        if (isExisitngAppointment) {
            throw new Error('Эти время и дата уже заняты')
        }

        const isDateBlocked = await BlockedDate.findOne({ date })
        if (isDateBlocked) {
            throw new Error('Дата заблокирована')
        }

        const data = new Appointment({
            date: date,
            time: time,
            ...(clientName && { clientName }),
            ...(clientID && { clientID }),
            createdBy: createdBy,
            type: type,
            addedToApptID: addedToApptID
        })
        if (commentary) {
            data.commentaries.push({ text: commentary })
        }
        if (isNotificationNeeded && type !== 'addToFirst') {
            const formatedDate = formatDateDDMMYY(date)
            sendAddAppointmentMail(req, res, { recipientEmail, formatedDate, time })
        }

        await data.save()
        res.status(201).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getAppointments = async (req, res) => {
    try {
        const data = await Appointment.find({})
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getAppointmentByID = async (req, res) => {
    try {
        const data = await Appointment.findById(req.params.id)
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}
export const addAppointmentCommentary = async (req, res) => {
    try {
        const { id, text } = req.body        
        const data = await Appointment.updateOne(
            { _id: id },
            {
                $push: {
                    commentaries: {
                        text
                    }
                }
            }
        )
        res.status(201).send(data)
    } catch (err) {
        console.log(err)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const rescheduleAppointment = async (req, res) => {
    try {
        const { id, date, time, isNotificationNeeded, email, oldEmptyApptTime, newEmptyApptTime, apptType } = req.body
        const initialAppt = await Appointment.findOne({_id: id})
        const data = await Appointment.updateOne(
            { _id: id },
            {
                $set: {
                    time,
                    date
                }
            }
        )
        const old_time = initialAppt.time
        const old_date = formatDateDDMMYY(initialAppt.date)

        if (isNotificationNeeded) {            
            const formatedDate = formatDateDDMMYY(date)
            sendRescheduleAppointmentMail(req, res, { email, formatedDate, time, old_date, old_time })
        }
        console.log(apptType)
        if (apptType === 'first') {            
            const addToFirstAppt = await Appointment.findOne({ date: initialAppt.date, time: oldEmptyApptTime })
            if (!addToFirstAppt) {
                throw new Error('No such appontment/Нет такого визита')
            }
            console.log(addToFirstAppt)
            var { data: data2 } = await Appointment.updateOne(
                { _id: addToFirstAppt._id },
                {
                    $set: {
                        time: newEmptyApptTime,
                        date
                    }
                }
            )
        }
        res.status(201).send({data, data2})
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const removeAppointment = async (req, res) => {
    try {
        const data = await Appointment.findByIdAndDelete(req.params.apptID)
        const data2 = await Appointment.findOneAndDelete({ addedToApptID: req.params.apptID })
        if (data) { res.status(201).send({data, data2}) }
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getScheduledTimesByDate = async (req, res) => {
    try {
        const formatedDate = new Date(req.body.date).toISOString().split('T')[0]        
        const times = await Appointment.aggregate([
            { $match: { date: formatedDate } },
            { $project: { time: 1 } }
        ])
        const takenTimes = times.map(app => app.time)
        res.status(200).send(takenTimes)
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getAppointmentsOnBlockedDates = async (req, res) => {
    try {
        const blockedDates = await BlockedDate.find({})
        const dates = blockedDates.map(date => date.date)

        const appointments = await Appointment.find({
            date: { $in: dates }
        }).sort({ date: 1, time: 1 })

        res.status(200).send(appointments)
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const checkIfClientExistsAndModifyAppointments = async (req, res) => {
    try {
        const { name, clientID } = req.body
        const appointmentsWithNeededName = await Appointment.find({ clientName: name.toLowerCase() })
        if (appointmentsWithNeededName.length === 0) {
            return res.send('No match')
        }
        let idArray = appointmentsWithNeededName.map(appt => {
            return appt._id
        })
        const data = await Appointment.updateMany(
            { _id: { $in: idArray } },
            { $set: { clientID: clientID } }
        )
        res.send(data)

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}

export const getApptsByClientID = async (req, res) => {
    try {
        const { clientID } = req.params        
        const data = await Appointment.find({ clientID: clientID, date: { $gte: new Date().toISOString().slice(0, 10) } }).sort({ date: 1, time: 1 }) 
        
        if (data.length > 0) { res.status(200).send(data) } else {throw new Error('Nothing found/Ничего не найдено')}
    } catch (err) {
        console.log(err.message)
        res.status(500).send({ errorMessage: err.message, data: null })
    }
}