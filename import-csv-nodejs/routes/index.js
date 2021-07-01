const express = require("express");
const fastcsv = require("fast-csv");
const csvexpress = require("csv-express");
const router = express.Router();
const fs = require("fs");
const mongoose = require("mongoose");
const CarConsume = require("../models/CarConsume");

const csvfile = __dirname + "/../public/files/carconsume.csv";
const stream = fs.createReadStream(csvfile);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Car Consume" });
});

router.get("/import", function (req, res, next) {
  const csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      const item = new CarConsume({
        distance: data[0],
        consume: data[1],
        speed: data[2],
        temp_inside: data[3],
      });
      item.save(function (error) {
        console.log(item);
        if (error) {
          throw error;
        }
      });
    })
    .on("end", function () {
      console.log("Fim da importação.");
    });
  stream.pipe(csvStream);
  res.json({ success: "A importação foi um sucesso.", status: 200 });
});

router.get("/fetchdata", function (req, res, next) {
  CarConsume.find({}, function (err, data) {
    console.log(data);
    if (!err) {
      res.render("fetchdata", {
        title: "Lista Car Consume",
        data,
      });
    } else {
      throw err;
    }
  });
});

router.get("/export", function (req, res, next) {
  const filename = "exported_file.csv";
  CarConsume.find()
    .lean()
    .exec({}, function (err, data) {
      if (err) res.send(err);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=" + filename);
      res.csv(data, true);
      console.log(data);
      console.log("A exportação foi um sucesso.");
    });
});

router.get("/create-form", function (req, res, next) {
  CarConsume.find({}, function (err, data) {
    if (!err) {
      res.render("create", {
        title: "Criar um novo registro",
      });
    } else {
      throw err;
    }
  });
});

router.post("/create", function (req, res, next) {
  const data = new CarConsume({
    distance: req.body.distance,
    consume: req.body.consume,
    speed: req.body.speed,
    temp_inside: req.body.temp_inside,
  });

  data.save(function (error) {
    console.log(data);
    if (error) {
      throw error;
    }
  });

  res.redirect("/fetchdata");
});

router.get("/edit/:id", function (req, res, next) {
  CarConsume.find({ _id: req.params.id }, function (err, data) {
    if (!err) {
      res.render("edit", {
        title: "Edit",
        _id: data[0]._id,
        distance: data[0].distance,
        consume: data[0].consume,
        speed: data[0].speed,
        temp_inside: data[0].temp_inside,
      });
    } else {
      throw err;
    }
  });
});

router.post("/edition/:id", function (req, res, next) {
  const filter = { _id: req.params.id };
  const update = {
    distance: req.body.distance,
    consume: req.body.consume,
    speed: req.body.speed,
    temp_inside: req.body.temp_inside,
  };

  CarConsume.updateOne(filter, update).then(() => {
    res.redirect("/fetchdata");
  });
});

router.get("/delete/:id", function (req, res, next) {
  const id = { _id: req.params.id };
  CarConsume.deleteOne(id).then(() => {
    res.redirect("/fetchdata");
  });
});

module.exports = router;
