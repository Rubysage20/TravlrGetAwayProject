const  express = require('express');
const  router = express.Router();

// const tripsController = require('../controllers/trips'); 

//define the route for our trips endpoint

// Homepage(server side rendering
router.get('/', (req, res) => {
  res.render('index', { title: 'Travlr Getaways' });
});

/* GET home page. */
//router
//.route('/trips')
//.get(tripsController.tripsList)
//.post(tripsController.tripsAddTrip); // POST Method Adds a trip

//router
//.route('/trips/:tripCode')
//.get(tripsController.tripsFindByCode);

module.exports = router;
