const mongoose = require('mongoose');

const SheetSchema = new mongoose.Schema({
    sheetId: {
        type: String,
        required: true,
        unique: true, 
        default: "main", 
    },
    data: {
        type: [[String]], 
        required: true,
    },
    rows: {
        type: Number,
        required: true,
    },
    columns: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Sheet', SheetSchema);