const routes = require("express").Router();

const { resultsController } = require("../controller/index");

routes.get("/result-pdf/:registerNo", resultsController.getResultsPdf);

routes.get("/result/:registerNo", resultsController.getResultsJson);

module.exports = routes;
