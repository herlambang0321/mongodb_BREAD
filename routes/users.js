var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectId;

module.exports = function (db) {
  const collection = db.collection('bread');
  router.get('/', async function (req, res, next) {
    try {
      const data = await collection.find({}).toArray();
      res.json(data)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const data = await collection.insertOne({ stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: req.body.booleandata });
      const item = await collection.findOne({ _id: data.insertedId })
      res.json(item)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.put('/:id', async function (req, res, next) {
    console.log(req.params.id)
    try {
      const data = await collection.updateOne({ _id: new ObjectID(req.params.id) }, { $set: { stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: req.body.booleandata } }, { upsert: true });
      // const item = await collection.findOne()
      res.json(data)
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  });

  return router;
}