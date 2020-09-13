const MongoClient = require('mongodb').MongoClient;
const retry = require( 'p-retry' );

const milliseconds = ms => ms;
const seconds = s => milliseconds( s * 1000 );

async function connectToDb() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://dbUser:dbPassword@cluster0.gw8ra.mongodb.net/test?retryWrites=true&w=majority";


    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  testConnection(client);

        return client;
    } catch (e) {
        console.error(e);
        const connection = await retryConnection( client );
        return connection
    }
}

async function testConnection ( client ){
    const databasesList = await client.db().admin().listDatabases();

    console.log("Connected to Database");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function retryConnection ( conn ) {
    await retry( testConnection( conn ), {
        retries: 20,
        maxTimeout: seconds( 30 ),
        onFailedAttempt: err => {
            reconnect( conn );
            if ( err.retriesLeft > 0 )
                log.warn( `Failed to connect to database. Retrying ${err.retriesLeft} more times. (${err.message})` );
        }
    });
}

async function reconnect ( client ) {
    console.log( 'retrying db connection...')
    if ( client ) {
        client.close();
    }
    await connectToDb();
}

module.exports.connectDb = connectToDb;
module.exports.listDatabases = testConnection;
