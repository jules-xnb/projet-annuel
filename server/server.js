const express = require('express') 
const app = express()
const mongoose = require('mongoose')
const dotenv = require ('dotenv') 
const cors = require ('cors')

const userRoutes = require('./routes/UserRoutes')
const itemRoutes = require ('./routes/ItemRoutes')
const bidRoutes = require ('./routes/BidRoutes')

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
mongoose.set('useCreateIndex', true);

app.use(express.json())
app.use(cors())

app.use('/bid', bidRoutes)
app.use('/item', itemRoutes)
app.use('/user', userRoutes)
app.listen(4000, () => console.log("Server run on port 4000"))








