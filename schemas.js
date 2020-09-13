const Joi = require( 'joi' );

const employeeSchema = Joi.object().keys({
    firstName: Joi.string().min( 3 ).required(),
    lastName: Joi.string().min( 3 ).required(),
    email: Joi.string().email({ tldWhitelist: [ 'com' ] }).required(),
    department: Joi.string().max( 5 ).default( 'IT' ).uppercase()
})