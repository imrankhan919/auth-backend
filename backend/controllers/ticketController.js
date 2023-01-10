const asyncHandler = require('express-async-handler')

const User = require("../models/userModel")
const Ticket = require("../models/ticketModel")

// @desc : GET user tickets
// @route : /api/tickets
// @access : private

const getTickets = asyncHandler(async (req,res) => {
    // Get user using the id int the JWT
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const tickets = await Ticket.find({
        user : req.user.id
    })
    res.status(200).json(tickets)

})

// @desc : Create new ticket
// @route : /api/tickets
// @access : private

const createTicket = asyncHandler(async (req,res) => {
    const {product , description } = req.body

    if(!product || !description){
        res.status(400)
        throw new Error('Please add a products and description')
    }

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.create({
        product,
        description,
        user : req.user.id,
        status : "new"

    })

    if(ticket){
        res.status(201).json(ticket)   
    }else{
        res.status(400)
        throw new Error("Invalid Ticket Data")
    }

})


// @desc : Get user ticket
// @route : /api/tickets/:id
// @access : private

const getTicket = asyncHandler(async (req,res) => {

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error ('Not Authorized')
    }

    res.status(200).json(ticket)

})


// @desc : Delete user ticket
// @route : /api/tickets/:id
// @access : private

const deleteTicket = asyncHandler(async (req,res) => {

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error ('Not Authorized')
    }

    await ticket.remove()

    res.status(200).json({success : true})

})


// @desc : update user ticket
// @route : /api/tickets/:id
// @access : private

const updateTicket = asyncHandler(async (req,res) => {

    // Get user using th id in JWT
    const user = await User.findById(req.user.id)

    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    if(ticket.user.toString() !== req.user.id){
        res.status(401)
        throw new Error ('Not Authorized')
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id , req.body , {new : true})

    res.status(200).json(updatedTicket)

})



module.exports = {getTickets , createTicket , getTicket , deleteTicket , updateTicket}