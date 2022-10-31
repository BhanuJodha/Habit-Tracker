const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ["Done","Not-Done","None"]
    }
}, {
    timestamps: true
});

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;