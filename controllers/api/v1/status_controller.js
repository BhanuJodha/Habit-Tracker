const Habit = require("../../../models/habit");
const Status = require("../../../models/status")

exports.toggle = async (req, res) => {
    try {
        const habit = await Habit.findById(req.body.hid);
        const yyyy = req.body.yyyy;
        const mm = req.body.mm;
        const dd = req.body.dd;
        console.log(req.body)


        // check if habit exist
        if (habit) {
            const today = new Date();
            const createdAt = new Date(habit.createdAt);

            // +1 to match month indexing
            if (
                // check if change date is not less than created date
                (createdAt.getFullYear() < yyyy ||
                    (createdAt.getFullYear() == yyyy &&
                        (createdAt.getMonth() + 1 < mm ||
                            (createdAt.getMonth() + 1 == mm && createdAt.getDate() <= dd)
                        )
                    )
                ) &&
                // and also not grater than today date
                (today.getFullYear() > yyyy ||
                    (today.getFullYear() == yyyy &&
                        (today.getMonth() + 1 > mm ||
                            (today.getMonth() + 1 == mm && today.getDate() >= dd)
                        )
                    )
                )
            ) {

                let status = await Status.findOne({ habit: habit._id, createdAt: new Date(`${yyyy}-${mm}-${dd}`) });

                // if status found
                if (status) {
                    // toggle it
                    switch (status.status) {
                        case "Done":
                            status.status = "Not-Done";
                            break;
                        case "Not-Done":
                            status.status = "None";
                            break;
                        case "None":
                            status.status = "Done";
                            break;
                        default:
                            break;
                    }
                    // save changed status in DB
                    await status.save();

                    return res.status(200).json({
                        data: {
                            status
                        },
                        message: "Status changed sucessfully"
                    });
                }
                else {
                    // create it
                    status = await Status.create({ habit: habit._id, status: "Done", createdAt: new Date(`${yyyy}-${mm}-${dd}`) });

                    // save status in habit
                    habit.dailyStatus.push(status._id);
                    await habit.save();

                    return res.status(201).json({
                        data: {
                            status
                        },
                        message: "Status created sucessfully"
                    });
                }
            }
            else {
                return res.status(400).json({
                    data: null,
                    message: "Invalid date"
                });
            }
        }

        return res.status(400).json({
            data: null,
            message: "Invalid habit ID"
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

exports.fetch = (req, res) => {
    const hid = req.body.hid;
    const yyyy = req.body.yyyy;
    const mm = req.body.mm;
    const dd = req.body.dd;

    // if credentials are not null
    if (hid && yyyy && mm && dd) {
        // find status on the date
        Status.findOne({ habit: hid, createdAt: { $gte: `${yyyy}-${mm}-${dd}`, $lte: `${yyyy}-${mm}-${Number(dd) + 1}` } }, (err, status) => {

            // error in finding status
            if (err) {
                console.log(err);
                return res.status(400).json({
                    data: {
                        error: err.name
                    },
                    message: err.message
                })
            }

            // if status found
            if (status) {
                return res.status(302).json({
                    data: {
                        status
                    },
                    message: "Status found sucessfully"
                });
            }

            // if status not found
            return res.status(404).json({
                data: null,
                message: "Status not found or NONE"
            });
        });
    }
    // invalid credentials
    else {
        res.status(400).json({
            data: null,
            message: "Incomplete or invalid information"
        });
    }
}


exports.fetchAll = (req, res) => {
    // if habit id not found
    if (!req.query.hid) {
        return res.status(400).json({
            data: null,
            message: "Invalid habit ID"
        });
    }

    Habit.findById(req.query.hid)
        .populate({
            path: "dailyStatus",
            sort: "-createdAt"
        })
        .exec((err, habit) => {
            // error in finding status
            if (err) {
                console.log(err);
                return res.status(500).json({
                    data: null,
                    message: "Internal server error"
                })
            }

            return res.status(200).json({
                data: {
                    habit
                },
                message: "Habit with daily status"
            });
        })
}