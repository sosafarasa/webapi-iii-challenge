const express = require("express");

const Users = require("./userDb.js");
const Posts = require("../posts/postDB.js");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "There was an error creating the new user." });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  const post = req.body;
  const { id } = req.params;
  post.user_id = id;

  Posts.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "There was an error adding the user's post." });
    });
});

router.get('/', (req, res) => {
    Users.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: "Could not retrieve user information." });
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    Users.getById(id)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(400).json({ message: "The user with that ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
   const { id } = req.params;

   Users.getUserPosts(id)
    .then(userPost => {
      if (userPost) {
        res.status(200).json(userPost);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Users.remove(id)
      .then(deleted => {
        if (deleted) {
          res.status(200).json(deleted);
        } else {
          res.status(404).json({ message: "That user ID does not exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "There was an error removing that user." });
    });
});

router.put('/:id', validateUser, (req, res) => {
    const id = req.params.id;
    const changes = req.body;
  
    Users.update(id, changes)
      .then(updated => {
        if (updated) {
          res.status(200).json(updated);
        } else {
          res.status(404).json({ message: "The user with that id doesnt exist." });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "There was an error updating the user." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
   const { id } = req.params;

   Users.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "Invalid user ID." });
    }
  });
  next()
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "Missing user data." });
    } else if (!req.body.name) {
        res.status(400).json({ message: "Missing required name field." });
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "Missing post data." });
    } else if (!req.body.text) {
        res.status(400).json({ message: "Missing required text field." });
    } else {
        next();
    }
};

module.exports = router;
