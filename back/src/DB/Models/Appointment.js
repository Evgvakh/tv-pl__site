import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        set: val => val.toLowerCase()
    },
    clientID: {
        type: String
    },
    type: {
        type: String,
        enum: ['first', 'notFirst', 'addToFirst'],
        required: true
    },
    addedToApptID: {
        type: String,
        required: function () {
            return this.type === 'addToFirst';
        }
    },
    commentaries: [
        {            
            text: {type: String, required: true},
            createdAt: { type: Date, default: Date.now }
        },        
    ],
    createdBy: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    }
})

export default mongoose.model("Appointment", AppointmentSchema)