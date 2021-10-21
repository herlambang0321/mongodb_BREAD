var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

module.exports = function (db) {
  const collection = db.collection('bread');
  router.get('/', async function (req, res, next) {
    try {
      const data = await collection.find({}).toArray();
      // console.log(typeof data[5].booleandata)
      res.json(data)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const data = await collection.insertOne({ stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: JSON.parse(req.body.booleandata) });
      const item = await collection.findOne({ _id: data.insertedId })
      res.json(item)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.put('/:id', async function (req, res, next) {
    console.log(req.params.id)
    try {
      const data = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: JSON.parse(req.body.booleandata) } }, { upsert: true });
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      res.json(item)
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  });

  router.delete('/:id', async function (req, res, next) {
    console.log(req.params.id)
    try {
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      const data = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(item)
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  });

  return router;
}