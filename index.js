const express = require( 'express' );
const bodyParser = require('body-parser')
const morgan = require('morgan');
const { connectDb, listDatabases } = require( './db' );
const { employeeSchema, updateEmployeeSchema } = require( './schemas' );

const app = express();

main( app );


async function main () {
    const client = await connectDb();
    const berkadiaDB = client.db( 'berkadia' );
    app.listen( 3000, () => console.log( 'app listening on 3000' ) );

    // request logging.
    app.use( morgan( 'short' ) );
    app.use( bodyParser.urlencoded({ extended: true }) );

    app.get( '/testConnection', async ( req, res ) => {
        try {
            await client.db().admin().listDatabases();
        } catch ( err ) {
            console.log( err );
            res.status( 500 ).send( 'error' );
        }
        res.send( 'done' );
    });

    app.get( '/getAllEmployees', async ( req, res ) => {
        const employees = await berkadiaDB.collection( 'employees' ).find().toArray();

        res.json({ employees });
    });

    app.post( '/createEmployee', validateMiddleware( employeeSchema ), errorHandler, async ( req, res ) => {
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

    app.put( '/updateEmployee', async ( req, res ) => {
        try {
            const { email, firstName, lastName, department } = req.body;
            if ( email ) {
                updateEmployeeSchema.validateAsync({ email }).catch( err => {
                    res.status( 400 ).send( err.details[0].message );
                    throw new Error( err.details[0].message );
                });
            }

            if ( firstName ) {
                updateEmployeeSchema.validateAsync({ firstName }).catch( err => {
                    res.status( 400 ).send( err.details[0].message );
                    throw new Error( err.details[0].message );
                });
            }

            if ( lastName ) {
                updateEmployeeSchema.validateAsync({ lastName }).catch( err => {
                    res.status( 400 ).send( err.details[0].message );
                    throw new Error( err.details[0].message );
                });
            }

            if ( department ) {
                updateEmployeeSchema.validateAsync({ department }).catch( err => {
                    res.status( 400 ).send( err.details[0].message );
                    throw new Error( err.details[0].message );
                });
            }

            await berkadiaDB.collection( 'employees' ).findOneAndReplace({ email }, {
                email,
                firstName,
                lastName,
                department
            });
            res.status( 200 ).send( 'Updated employee' );
        } catch ( err ) {
            console.log( err );
            res.status( 500 ).send( 'Something went wrong' );
        }
    });

    app.delete( '/deleteEmployee', async ( req, res ) => {
        try {
            const { email } = req.body;

            updateEmployeeSchema.validateAsync({ email }).catch( err => {
                res.status( 400 ).send( 'Invalid email' );
                return;
            });

            await berkadiaDB.collection( 'employees' ).deleteOne({ email });
            res.sendStatus( 204 );
        } catch ( err ) {
            res.status( 500 ).send( 'Something went wrong' );
        }
    });

    app.delete( '/clearCollection', async ( req, res ) => {
        await berkadiaDB.collection( 'employees' ).drop()
        res.sendStatus( 204 );
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
