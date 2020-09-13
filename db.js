const MongoClient = require('mongodb').MongoClient;

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
        await  listDatabases(client);

        return client;
    } catch (e) {
        console.error(e);
    }
}

async function listDatabases( client ){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

connectToDb().catch(console.error);

module.exports.connectDb = connectToDb;
module.exports.listDatabases = listDatabases;