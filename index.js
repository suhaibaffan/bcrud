const express = require( 'express' );
const bodyParser = require('body-parser')
const Joi = require('joi');
const { connectDb, listDatabases } = require( './db' );

const app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
main( app );

app.listen( 3000, () => console.log( 'Server listening on 3000' ) );


async function main ( server ) {
    const client = await connectDb();
    const berkadiaDB = client.db( 'berkadia' );

    server.get( '/', async ( req, res ) => {
        try {
            const dbs = await client.db().admin().listDatabases();
        } catch ( err ) {
            console.log( err );
        }
        res.send( 'done' );
    });

    server.post( '/', async ( req, res ) => {

    });
}

const validateMiddleware = joiSchema => async ( req, res, next ) => {
    const { error } = Joi.validate( req.body, schema );

    if ( error )
        throw new Error( error );

    next();
};