const mongoose = require('mongoose'); // Mongoose library
const Trip = require('../models/travlr'); // Mongoose model
const Model = mongoose.model('trips'); // Mongoose model instance

// GET: /api/trips - list all trips
const tripsList = async (_req, res) => {
  try {
    const trips = await Trip.find({}).exec();
    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// GET: /api/trips/:tripCode - get one by code
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip.findOne({ code: req.params.tripCode }).exec();
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// POST: /api/trips - add a trip
const tripsAddTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });
    return res.status(201).json(trip);
  } catch (err) {
    return res.status(400).json({ message: 'Create failed', error: err.message });
  }
};

// PUT: /api/trips/:tripCode - update a trip
const tripsUpdateTrip = async (req, res) => {
  try {
    const { tripCode } = req.params;

    // allow only known fields
    const allowed = ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'];
    const update = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided' });
    }

    const updated = await Trip.findOneAndUpdate(
      { code: tripCode },
      { $set: update },
      { new: true, runValidators: true }
    ).exec();

    if (!updated) return res.status(404).json({ message: 'Trip not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};