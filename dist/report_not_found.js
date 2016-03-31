"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = reportNotFound;

function reportNotFound() {
  this.requestData.status = 404;
}

module.exports = exports["default"];
