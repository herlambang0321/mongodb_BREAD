var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

module.exports = function (db) {
  const collection = db.collection('bread');
  router.get('/', async function (req, res, next) {
    try {
      let params = {};

      if (req.query.idcheck && req.query.id) {
        params['_id'] = new ObjectId(req.query.id)
      }

      if (req.query.checkstring && req.query.string) {
        params['stringdata'] = new RegExp(`${req.query.string}`, 'i')
      }

      if (req.query.checkinteger && req.query.integer) {
        params['integerdata'] = parseInt(req.query.integer)
      }

      if (req.query.checkfloat && req.query.float) {
        params['floatdata'] = parseFloat(req.query.float)
      }

      if (req.query.checkdate && req.query.startdate && req.query.enddate) {
        params['datedata'] = req.query.startdate, req.query.enddate
      }

      if (req.query.checkboolean && req.query.boolean) {
        params['booleandata'] = JSON.parse(req.query.boolean)
      }

      const page = req.query.page || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      const pages = await collection.find(params).count();
      const data = await collection.find(params).limit(limit).skip(offset).toArray();

      res.json({
        data: data,
        page: parseInt(page),
        pages: Math.ceil(pages / limit)
      })
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

  router.get('/:id', async function (req, res, next) {
    try {
      const data = await collection.findOne({ _id: new ObjectId(req.params.id) })
      res.json(data)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const data = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: JSON.parse(req.body.booleandata) } }, { upsert: true });
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      res.json(item)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      const data = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(item)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  return router;
}