const express = require( 'express' );
const bodyParser = require('body-parser')
const Joi = require('joi');
const { connectDb, listDatabases } = require( './db' );
const { employeeSchema } = require( './schemas' );

const app = express();

main( app );


async function main ( server ) {
    const client = await connectDb();
    const berkadiaDB = client.db( 'berkadia' );
    app.listen( 3000, () => console.log( 'Server listening on 3000' ) );

    server.use( bodyParser.urlencoded({ extended: true }) );

    server.get( '/testConnection', async ( req, res ) => {
        try {
            await client.db().admin().listDatabases();
        } catch ( err ) {
            console.log( err );
            res.status( 500 ).send( 'error' );
        }
        res.send( 'done' );
    });

    server.get( '/getAllEmployees', async ( req, res ) => {
        const employeesCursor = await berkadiaDB.collection( 'employees' ).find();
        const employees = [];
        employeesCursor.forEach( item => {
            employeesCursor.push( item );
        });
        res.send({ employees });
    });

    server.post( '/createEmployee', validateMiddleware( employeeSchema ), errorHandler, async ( req, res ) => {
        try {
            const employee = await berkadiaDB.collection( 'employees' ).findOne({ email: req.body.email });
            if ( !employee ) {
                const { value } = employeeSchema.validate({ ...req.body }, { abortEarly: false });
                await berkadiaDB.collection( 'employees' ).insertOne({ ...value });
                res.status( 201 ).send();
            } else {
                res.status( 400 ).send( 'Employee already exists' );
            }
        } catch ( err ) {
            res.status( 500 ).send( 'Something went wrong' );
        }
    });

    server.put( '/updateEmployee', validateMiddleware( employeeSchema), errorHandler, async ( req, res ) => {
        try {
            const { email, firstName, lastName } = req.body;
            const employee = await berkadiaDB.collection( 'employee' ).findOneAndUpdate({ email }, {
                firstName,
                lastName,
                department
            });
        } catch ( err ) {
            res.status( 500 ).send( 'Something went wrong' );
        }
    });
}

const validateMiddleware = joiSchema => async ( req, res, next ) => {
    try {
        const { error } = joiSchema.validate({ ...req.body }, { abortEarly: false });

        if ( error ) {
            next( error );
        }
    
        next();
    } catch ( err ) {
        console.log( 'something went wrong' );
        next( err );
    }
};

function errorHandler (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(400);
    res.send({ err });
}
