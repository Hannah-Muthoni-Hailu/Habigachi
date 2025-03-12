const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
    return [
        body("username")
        .exists({ values: 'falsy' })
        .withMessage("User name is required")
        .isString()
        .withMessage("User name should be a string"),
        body("password")
        .exists()
        .withMessage("Password is required")
        .isLength({min: 8, max: 16})
        .withMessage("Password must be between 8 and 16 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/)
        .withMessage("Password must include lower and upercase letters, a number and a special character (@, #, $, %)"),
        body("email")
        .exists()
        .withMessage("Email is required")
        .matches(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/)
        .withMessage("Ensure the email format is correct"),
    ]
}

const userLoginValidationRules = () => {
    return [
        body("username")
        .exists({ values: 'falsy' })
        .withMessage("User name is required")
        .isString()
        .withMessage("User name should be a string"),
        body("password")
        .exists()
        .withMessage("Password is required")
        .isLength({min: 8, max: 16})
        .withMessage("Password must be between 8 and 16 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/)
        .withMessage("Password must include lower and upercase letters, a number and a special character (@, #, $, %)"),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()){
        return next();
    }

    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg}))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = { userValidationRules, validate, userLoginValidationRules };