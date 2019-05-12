const MongoClient = require('mongodb').MongoClient;

let connection = null;

exports.init = function(callback) {
    let url = process.env.MONGODB_URI;
    if (url == null || url == "")
        throw new Error("Please set environment variable MONGODB_URI with connection url to the database.");
    connect(url, function(err) {
        if (err != null) {
          console.log(err);
          throw err;
        } else {
          console.log("Connected to mongo database.");
          callback();
        }
    });
}

function connect(url, done) {
  if (connection) return done()

  MongoClient.connect(url, {poolSize:5, useNewUrlParser:true}, function(err, client) {
    if (err) return done(err)
    connection = client;
    done()
  })
}

exports.get = function() {
  return connection;
}

exports.close = function() {
  if (connection) {
    connection.close(function(err, result) {
      connection = null;
      if (err) {
        console.log(`Error while closing mongo connection: ${err}`);
      } else {
        console.log('Closed connection to mongo');
      }
    })
  }
}