const express = require('express');

const router = express.Router();
const Subscriber = require('../models/Subscriber'); // Adjust the path as necessary

// @route   POST /api/subscribe
// @desc    Handle newletter subscription
// @access  Public

router.post('/', async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the email already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        // Create a new subscriber
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        return res.status(201).json({ message: ' Successful Subscribed to the newsletter! ' });      

        
    } catch (error) {
        console.error('Error subscribing:', error);
        return res.status(500).json({ message: 'Server error' });
        
    }

})


module.exports = router;