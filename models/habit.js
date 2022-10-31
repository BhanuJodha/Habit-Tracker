const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    dailyStatus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status"
    }]
},{
    timestamps: true
});

const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;