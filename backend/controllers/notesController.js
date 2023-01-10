const asyncHandler = require('express-async-handler')

const Ticket = require("../models/ticketModel")
const User = require("../models/userModel")
const Note = require("../models/notesModel")


// @desc Get notes from ticket
// @route GET /api/tickets/ticketID/notes
// @access Private

const getNotes = asyncHandler(async (req,res) => {

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)

    if(!ticket){
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error ('Not Authorized')
    }

    const notes = await Note.find({ticket : req.params.ticketId})
    res.status(200).json(notes)

})


// @desc Create notes 
// @route GET /api/tickets/ticketID/notes
// @access Private

const addNote = asyncHandler(async (req,res) => {

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.ticketId)

    if(!ticket){
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error ('Not Authorized')
    }

    const note = await Note.create({
        text : req.body.text,
        isStaff : false,
        ticket : req.params.ticketId,
        user : req.user.id
    })

    res.status(200).json(note)

})


module.exports = {getNotes , addNote}
