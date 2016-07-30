import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as openResource from 'open';
import { resolve } from 'path';
import * as serveStatic from 'serve-static';

import * as mongoose from 'mongoose'; // Wrapper for interacting with MongoDB
import * as bodyParser from 'body-parser'; 

import * as codeChangeTool from './code_change_tools';
import { APP_BASE, COVERAGE_PORT, DOCS_DEST, DOCS_PORT, PORT, PROD_DEST } from '../../config';

var Schema = mongoose.Schema;  

const userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  polls: [{type: Schema.Types.ObjectId, ref: 'Poll'}]
});
const User = mongoose.model('userSchema', userSchema); 

const pollSchema = new Schema({
  name: String,
  creatorId: String,
  options: Array,
  dateAdded: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});
const Poll = mongoose.model('pollSchema', pollSchema); 

/**
 * Serves the Single Page Application. More specifically, calls the `listen` method, which itself launches BrowserSync.
 */
export function serveSPA() {
  codeChangeTool.listen();
}

/**
 * This utility method is used to notify that a file change has happened and subsequently calls the `changed` method,
 * which itself initiates a BrowserSync reload.
 * @param {any} e - The file that has changed.
 */
export function notifyLiveReload(e:any) {
  let fileName = e.path;
  codeChangeTool.changed(fileName);
}

/**
 * Starts a new `express` server, serving the static documentation files.
 */
export function serveDocs() {
  let server = express();

  server.use(
    APP_BASE,
    serveStatic(resolve(process.cwd(), DOCS_DEST))
  );

  console.log('Serve DOCS Starting.');

  server.listen(DOCS_PORT, () =>
    openResource('http://localhost:' + DOCS_PORT + APP_BASE)
  );
}

/**
 * Starts a new `express` server, serving the static unit test code coverage report.
 */
export function serveCoverage() {
  let server = express();
  let compression = require('compression');
      server.use(compression());

  server.use(
    APP_BASE,
    serveStatic(resolve(process.cwd(), 'coverage'))
  );

  console.log('Serve Coverage Starting.');

  server.listen(COVERAGE_PORT, () =>
    openResource('http://localhost:' + COVERAGE_PORT + APP_BASE)
  );
}

/**
 * Starts a new `express` server, serving the built files from `dist/prod`.
 */
export function serveProd() {
  let root = resolve(process.cwd(), PROD_DEST);
  let server = express();

  server.use(bodyParser.json());

  let compression = require('compression');
      server.use(compression());

  mongoose.connect('mongodb://localhost:27017/pollingDB'); // Connect to MongoDB database for polling app.  
  // Make sure mongod is running! If not, log an error and exit. 

  mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  });

  // ********** API ROUTES **************************
  // BEGIN API ROUTES

  server.get('/api', function(req, res) {
      return res.send('Default API route...');
  });

  // -------------- POLLS ROUTES --------------------
  server.get('/api/polls', function(req, res) {
    Poll.find({}, function (err, polls) {
        res.json(polls);
    });   
  });  

  //server.get('/api/items', pollsController.getAllPolls); // Handle GET request at /polls endpoint to retrieve all the polls

  server.post('/api/polls', function(req, res) {
    // Create a new poll

    let poll = new Poll({
      name: req.body.name,
      creatorId: req.body.creatorId,
      options: req.body.options
    });

    poll.save(function (err, poll) {
      if (err) { 
        console.log('error saving poll: ', err);
      }
      res.status(201).json(poll);
    });

  });

  server.get('/api/polls/:id', function(req, res) {
    let id = req.params.id;
    Poll.findOne({'_id':id},function(err, result) {
      return res.send(result);
    });             
  });

  server.put('/api/polls/:id', function(req, res) {
    //let id = req.params.id;
    //console.log('Will update poll with id of: ', id);

    let poll = req.body;
    let id = poll._id;

    delete poll._id;

    if (id) {
        Poll.update({_id: id}, poll, {upsert: true}, function (err, poll) {
          //res.json(poll);
          Poll.findOne({'_id':id},function(err, result) {
            return res.send(result);
          });           
        });
    }    
   
  });

  server.delete('/api/polls/:id', function(req, res) {
    //return res.send('API Route to DELETE a poll with id of: ' + req.params.id);
    let id = req.params.id;
    Poll.remove({'_id': id},function(result) {
      Poll.find({}, function (err, polls) {
          res.json(polls);
      });      
    });    

  });  

  // -------------- USERS ROUTES --------------------
  server.get('/api/users', function(req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });  
  }); 

  server.post('/api/users', function(req, res) {
    // Create a new User
    let user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email
    });

    user.save(function (err, user) {
      if (err) { 
        console.log('error saving user: ', err);
      }
      res.status(201).json(user);
    });

  });  

  server.get('/api/users/:id', function(req, res) {
    // Return all users
    return res.send('User Specific API for user with id of: ' + req.params.id);
  });  

  // END API ROUTES
  // ************************************************


  server.use(APP_BASE, serveStatic(root));

  server.use(fallback('index.html', { root }));

  //server.use('/api', router);
  //server.get('/polls', mainController.getAllPolls); // Handle GET request at /polls endpoint to retrieve all the polls

  server.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE)
  );
};
