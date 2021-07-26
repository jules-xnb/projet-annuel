const User = require('../models/UserModels')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        address: req.body.address,
        password: hash,
        actualBalance: 0,
        totalBalance: 0
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ address: req.body.address })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.delete = (req, res, next) => {
  User.findOneAndDelete({ address: req.body.address }, (err, user) => {
    if (err) {
        return res.status(400).json({ success: false, error: err })
    }

    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    }

    return res.status(200).json({ success: true, data: user })
  }).catch(err => console.log(err))
  
};

exports.update = (req, res, next) => {
  const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    User.findOne({ address: body.address }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        user.actualBalance = body.actualBalance
        user.totalBalance = body.totalBalance
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })

    
  
};

exports.getAll = (req, res, next) => {
  User.find({})
  .then(data => res.status(201).json(data))
  .catch(error => res.status(401).json(error))
}

exports.getByAddress = (req, res, next) => {
  User.find({address: req.body.address})
  .then(data => res.status(201).json(data))
  .catch(error => res.status(401).json(error))
}


















