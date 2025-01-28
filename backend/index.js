const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sheet = require('./models/Sheet');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/', (req, res) => {
    res.json({ message: "Hello World!" })
});

app.post('/api/sheets', async (req, res) => {
    try {
        const { data, rows, columns } = req.body;

        const sheet = await Sheet.findOneAndUpdate(
            { sheetId: "main" }, 
            { data, rows, columns }, 
            { upsert: true, new: true } 
        );

        res.status(200).json({ message: 'Sheet saved/updated successfully!', sheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save/update sheet.' });
    }
});

app.get('/api/sheets/:sheetId', async (req, res) => {
    try {
        const { sheetId } = req.params;
        const sheet = await Sheet.findOne({ sheetId });

        if (!sheet) {
            return res.status(404).json({ message: 'Sheet not found.' });
        }

        res.status(200).json(sheet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch sheet data.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});