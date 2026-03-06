const { body, validationResult } = require("express-validator");

const validator = [
    body("name").notEmpty().withMessage("Your name is required")
    ,
    
    body("username").trim().notEmpty().withMessage("A username is required"),
    
    body("email").trim().notEmpty().withMessage("An email is required").isEmail().withMessage("A valid email address is required"),
    
    body("password").notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
    
    body("confirmpassord".custom(value, { req }) => {
        if (value !== req.body.password){
            throw new Error("Passwords must match")
        } else {
            return true
        }
    })
]

module.exports = validator
