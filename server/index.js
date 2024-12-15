const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Expo } = require('expo-server-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Create a new Expo SDK client
const expo = new Expo();

// Example endpoint to handle notifications
app.post('/api/notifications', async (req, res) => {
    const { to, title, body } = req.body;

    // Create a message payload
    let messages = [];
    if (!Expo.isExpoPushToken(to)) {
        console.error(`Push token ${to} is not a valid Expo push token`);
        return res.status(400).json({ success: false, message: 'Invalid push token' });
    }

    messages.push({
        to: to,
        sound: 'default',
        title: title,
        body: body,
        data: { withSome: 'data' }, // Optional data you can send
    });

    try {
        // Send notifications in batches (up to 100 messages per batch)
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }

        console.log('Push notification tickets:', tickets);

        // Respond to the client
        res.status(200).json({ success: true, message: 'Notification sent successfully!' });
    } catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
