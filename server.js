var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

const MongoClient = require('mongodb').MongoClient
const express = require('express')

const app = express()

app.set('view engine', 'pug')

app.use(express.static('static'))

app.get('/', (req, res) => {
  res.render('index.pug')
})

MongoClient.connect(mongoURL, function(err, conn) {
  if (err) {
    callback(err);
    return;
  }

  db = conn;
  dbDetails.databaseName = db.databaseName;
  dbDetails.url = mongoURLLabel;
  dbDetails.type = 'MongoDB';

  console.log('Connected to MongoDB at: %s', mongoURL);
})

app.get('/q', (req, res) => {
  console.log(mongoURL)
  MongoClient.connect(`${mongoURL}/video`, (err, db) => {
    db.collection('movies').find({
      'title': {$regex: ('^' + req.query.name), $options: '-i'}
    }, {'limit': 20}).toArray((err, movies) => {
      res.json(movies)
      db.close()
    })
  })
})

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
