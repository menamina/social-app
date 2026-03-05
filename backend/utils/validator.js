const { body, validationResult } = require("express-validator");

const validator = [
    body("name").notEmpty().withMessage("Your name is required")
    ,
    body("username").trim().notEmpty().withMessage("A username is required"),
    body("email").trim().notEmpty().withMessage("An email is required").isEmail().withMessage("A valid email address is required"),
    body("password"),
    body("confirmpassord".custom(value, { req }) => {

    })
]

module.exports = validator