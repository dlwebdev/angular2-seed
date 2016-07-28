import Poll from '../models/Poll'; // Import the Poll model so we can query the DB

let pollController = {
  getIndex: (req, res) => {
    res.render('index'); // Compiles the file named "index" in the views directory (`/views`) using the view engine (Jade).
    // We'll create this Jade file later
  },
  // Allows us to access our Angular templates (more on that later)
  getTemplate: (req, res) => {
    res.render('templates/' + req.params.template);
  },
  getAllPolls: (req, res) => {
    Poll.find({}, (err, polls) => {
      if (err) {
        // Send the error to the client if there is one
        return res.send(err);
      }
      // Send polls in JSON format
      res.json(polls);
    });
  },
  postNewPoll: (req, res) => {
    // This creates a new poll using POSTed data (in req.body)
    Poll.create({
      name: req.body.name,
      creatorId: req.body.creatorId,
      options: req.body.options,
      dateAdded: req.body.dateAdded,      
      done: false
    }, (err, poll) => {
      if (err) {
        return res.send(err);
      }
      Poll.find({}, (err, polls) => {
        if (err) {
          return res.send(err);
        }
        // Send list of all polls after new one has been created and saved
        res.json(polls);
      });
    });
  },
  deletePoll: (req, res) => {
    Poll.remove({
      _id: req.params.id
    }, (err, poll) => {
      if (err) {
        return res.send(err);
      }
      Poll.find({}, (err, polls) => {
        if (err) {
          return res.send(err);
        }
        res.json(polls);
      });
    });
  }
}

export default pollController;