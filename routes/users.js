var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

module.exports = function (db) {
  const collection = db.collection('bread');
  router.get('/', async function (req, res, next) {
    try {
      const url = req.url == '/' ? '/?page=1' : req.url;
      let params = []

      if (req.query.idcheck && req.query.id) {
        params.push(`_id=${req.query.id}`)
      }

      if (req.query.checkstring && req.query.string) {
        params.push(`stringdata='${req.query.string}'`)
      }

      if (req.query.checkinteger && req.query.integer) {
        params.push(`integerdata=${req.query.integer}`)
      }

      if (req.query.checkfloat && req.query.float) {
        params.push(`floatdata=${req.query.float}`)
      }

      if (req.query.checkdate && req.query.startdate && req.query.enddate) {
        params.push(`datedata '${req.query.startdate}' and '${req.query.enddate}'`)
      }

      if (req.query.checkboolean && req.query.boolean) {
        params.push(`booleandata='${req.query.boolean}'`)
      }

      const page = parseInt(req.query.page) || 1;
      const limit = 3;
      const offset = (page - 1) * limit;

      // if (params.length > 0) {
      //   data.params += ` ${params.join(' and ')} || ""`
      // }
      const pages = await collection.find({}).count();

      const data = await collection.find({}).limit(limit).skip(offset).toArray();

      // data.forEach((item, index) => {
      //   item.id = index + 1
      // });
      
      // console.log(typeof data[5].booleandata)
      res.json({
        data: data,
        page: parseInt(page),
        pages: Math.ceil(pages / limit),
        query: req.query,
        url
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
      // console.log(data)
      res.json(data)
    } catch (err) {
      res.status(500).json({ err })
    }
  });

  router.put('/:id', async function (req, res, next) {
    // console.log(req.params.id);
    try {
      const data = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { stringdata: req.body.stringdata, integerdata: parseInt(req.body.integerdata), floatdata: parseFloat(req.body.floatdata), datedata: req.body.datedata, booleandata: JSON.parse(req.body.booleandata) } }, { upsert: true });
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      res.json(item)
    } catch (err) {
      // console.log(err)
      res.status(500).json({ err })
    }
  });

  router.delete('/:id', async function (req, res, next) {
    // console.log(req.params.id)
    try {
      const item = await collection.findOne({ _id: new ObjectId(req.params.id) })
      const data = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json(item)
    } catch (err) {
      // console.log(err)
      res.status(500).json({ err })
    }
  });

  return router;
}