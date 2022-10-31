const Habit = require("../../../models/habit");
const Status = require("../../../models/status");

exports.fetch = (req, res) => {
    const user = req.user;
    user.populate("habits", "-dailyStatus", (err, user)=>{
        if (err) {
            return res.status(500).json({
                data: null,
                message: "Internal server error"
            })
        }
        res.status(200).json({
            data: {
                habits: user.habits
            },
            message: `All habits of ${user.name}`
        })
    });
}

exports.fetchWithStatus = (req, res) => {
    const user = req.user;
    user.populate({
        path: "habits",
        populate: {
            path: "dailyStatus",
            options: {
                sort: "createdAt"
            }
        }
    }, (err, user)=>{
        if (err) {
            console.log(err)
            return res.status(500).json({
                data: null,
                message: "Internal server error"
            })
        }
        res.status(200).json({
            data: {
                habits: user.habits
            },
            message: `All habits of ${user.name} with status`
        })
    });
}

exports.add = async (req, res) => {
    try {
        const user = req.user;
        const habit = await Habit.create({
            content: req.body.content,
            user: user._id
        });
        user.habits.push(habit._id);
        await user.save();
        res.status(201).json({
            data: {
                habit
            },
            message: "Habit created sucessfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            data: {
                error: err.name
            },
            message: err.message
        })
    }
}

exports.remove = async (req, res) => {
    try {
        // finding habit
        const habit = await Habit.findById(req.query.hid);
        
        if (habit){
            // removing habit from user
            req.user.habits.splice(req.user.habits.findIndex((e) => e.toString() === habit.id), 1);
            await req.user.save();

            // deleting habit
            await habit.remove();

            // deleting status of a habit
            await Status.deleteMany({habit: req.query.hid});
        
            return res.status(200).json({
                data: {
                    habit
                },
                message: "Habit and assosiated status deleted sucessfully"
            });            
        }

        res.status(400).json({
            data: {
                hid: req.query.hid
            },
            message: "Invalid habit ID"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            data: {
                error: err.name
            },
            message: err.message
        })
    }
}

exports.toggleFav = async (req, res) => {
    console.log(req.body.hid,"hell")
    try {
        if (req.body.hid){
            const habit = await Habit.findById(req.body.hid);
            if (habit){
                habit.favourite = !habit.favourite;
                habit.save();
                return res.status(200).json({
                    data: {
                        habit
                    },
                    message: "Favourite toggled sucessfully"
                })
            }
    
        }
        return res.status(400).json({
            data: {
                hid: req.query.hid
            },
            message: "Invalid habit ID"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            data: {
                error: err.name
            },
            message: err.message
        })
    }
}