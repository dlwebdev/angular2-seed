'use strict';

import * as express from 'express';
var session        = require('express-session');

import * as fallback from 'express-history-api-fallback';
import * as openResource from 'open';
import { resolve } from 'path';
import * as serveStatic from 'serve-static';
import * as mongoose from 'mongoose'; // Wrapper for interacting with MongoDB
import * as bodyParser from 'body-parser'; 
import * as codeChangeTool from './code_change_tools';
import { APP_BASE, COVERAGE_PORT, DOCS_DEST, DOCS_PORT, PROD_DEST } from '../../config';

var port = process.env.PORT || 5555;
var MongoStore = require('connect-mongo')(session);
var Schema = mongoose.Schema;  

//let User = require('../../../src/server/models/User.js');

var UserSchema2 = new Schema({
  username: {type: String, required: true},
  email: {type: String},
  twitter: Array,
  polls: [{type: Schema.Types.ObjectId, ref: 'Poll'}]
});
var User = mongoose.model('User', UserSchema2); 

var pollSchema = new Schema({
  name: String,
  creatorId: String,
  options: Array,
  dateAdded: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});
var Poll = mongoose.model('Poll', pollSchema); 

var passport       = require('passport');
require('./passport')(passport);


// load the auth variables
require('./auth');


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
 * Starts a new `express` app, serving the built files from `dist/prod`.
 */
export function serveProd() {
  let root = resolve(process.cwd(), PROD_DEST);
  let app = express();

  app.use(bodyParser.json()); 

  app.use(passport.initialize());
  //app.use(passport.session()); 

  let compression = require('compression');
      app.use(compression());

  mongoose.connect('mongodb://admin:admin@ds139705.mlab.com:39705/fcc-polling-app'); // Connect to MongoDB database for polling app.  
  //mongoose.connect('mongodb://localhost:27017/pollingDB'); // Connect to MongoDB database for polling app.  

  // Make sure mongod is running! If not, log an error and exit. 

  mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
  });

  //app.use(session({ secret: 'my_precious_l@3' }));
  app.use(session({ 
    secret: 'my_precious_l@3', 
    cookie: { maxAge: 60000 },
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified     
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })); 

  // ********** API ROUTES **************************
  // BEGIN API ROUTES

  app.get('/api', function(req, res) {
      return res.send('Default API route...');
  });

  // -------------- POLLS ROUTES --------------------
  app.get('/api/polls', function(req, res) {
    Poll.find({}, function (err, polls) {
        res.json(polls);
    });   
  });  

  //server.get('/api/items', pollsController.getAllPolls); // Handle GET request at /polls endpoint to retrieve all the polls

  app.post('/api/polls', function(req, res) {
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

  app.get('/api/polls/:id', function(req, res) {
    let id = req.params.id;
    Poll.findOne({'_id':id},function(err, result) {
      return res.send(result);
    });             
  });

  app.put('/api/polls/:id', function(req, res) {
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

  app.delete('/api/polls/:id', function(req, res) {
    //return res.send('API Route to DELETE a poll with id of: ' + req.params.id);
    let id = req.params.id;
    Poll.remove({'_id': id},function(result) {
      Poll.find({}, function (err, polls) {
          res.json(polls);
      });      
    });    

  });  

  // -------------- USERS ROUTES --------------------
  app.get('/api/users', function(req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });  
  }); 

  app.post('/api/users', function(req, res) {
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

  app.get('/api/users/:id', function(req, res) {
    // Return all users
    let id = req.params.id;
    User.findOne({'_id':id},function(err, result) {
      return res.send(result);
    }); 
  });  

  app.get('/api/user/polls', function(req, res) {
    let sess = req.session;

    if(sess['passport']) {
      let userId = req.session['passport'].user;

      console.log('Looking for polls with a creator id of: ', userId);

      Poll.find({'creatorId': userId}, function (err, polls) {
          res.json(polls);
      });
    } else {
      res.json({});
    }
  });    

  // END API ROUTES
  // ************************************************

  // route for showing the profile page
  app.get('/user/profile', isLoggedIn, function(req, res) {
    //return res.send('API Route to DELETE a poll with id of: ' + req.params.id);
    /*
      res.render('profile.ejs', {
          user : req.user // get the user out of session and pass to template
      });
    */
  });

      // route for logging out
  app.get('/user/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/auth/currentuser', function(req,res){
      res.json(req.user);
  });

  app.get('/user/authenticated', function(req, res, next) {
    let authed = false;
    let sess = req.session;

    //if (req.isAuthenticated()) {
    //  authed = true;
    //}

    if(sess['passport']) {      
      authed = true;
    }      

    res.json({'authenticated': authed});
  });

  app.get('/user/get-id-of-logged-in', function(req, res, next) {
    let sess = req.session;
    let userId = '-1';

    if(sess['passport']) {
      //console.log('Passport detected in user session: ', sess['passport'].user);
      userId = sess['passport'].user;
    }  

    res.json({'userId': userId});
  });  

  // Twitter Auth API

  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
          successRedirect : '/polls',
          failureRedirect : '/login'
      }));

  // End Twitter Auth


  app.use(APP_BASE, serveStatic(root));

  app.use(fallback('index.html', { root }));

  //app.use('/api', router);
  //app.get('/polls', mainController.getAllPolls); // Handle GET request at /polls endpoint to retrieve all the polls

  app.listen(port, function() {
      console.log('Our app is running on ://localhost:' + port);
  });

  /*
  app.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE)
  );
  */

};

function isLoggedIn(req:any, res:any, next:any) {
  let sess = req.session;

  if(sess['passport']) {
    //console.log('Passport detected in user session: ', sess['passport'].user);
    return next();
  }   

    // if they aren't redirect them to the home page
    res.redirect('/');
}
