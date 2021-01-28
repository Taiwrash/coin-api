const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send({
    results: {
      message: "Api is running",
    },
  });
});

app.get("/api/rates", (req, res) => {
  if (/\?.+/.test(req.url)) {
    fetch("https://api.exchangeratesapi.io/latest?base=" + req.query.base + "")
      .then((response) => response.json())
      .then(function (data) {
        if ("error" in data == false) {
          let rate = {};

          req.query.currency.split(",").forEach(function (value) {
            if (value in data.rates) {
              rate[value] = data.rates[value];
            }
          });

          res.status(200).send({
            results: {
              base: req.query.base,
              date: data.date,
              rates: rate,
            },
          });
        } else {
          res.status(404).send({
            results: {
              message: data.error,
            },
          });
        }
      })
      .catch((err) =>
        res.status(404).send({
          results: {
            message: err,
          },
        })
      );
  } else {
    res.status(404).send({
      results: {
        message: "Base and currency is required",
      },
    });
  }
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
