const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/enviroment");

exports.create = (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) {
            return res.status(400).json({
                data: {
                    error: err.name
                },
                message: err.message
            })
        }
        return res.status(201).json({
            data: {
                user
            },
            message: "User created sucessfully"
        })
    })
}

exports.sign = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                data: {
                    error: err.name
                },
                message: err.message
            })
        }
        if (user && user.password === req.body.password) {
            return res.status(202).json({
                data: {
                    Bearer: jwt.sign({_id: user.id}, env.jwt_key, { expiresIn: "300000" })
                },
                message: "Token created sucessfully"
            })
        }

        res.status(400).json({
            data: {
                body: req.body
            },
            message: "Invalid credentials"
        })
    })
}