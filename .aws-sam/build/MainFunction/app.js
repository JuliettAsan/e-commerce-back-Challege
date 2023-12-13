"use strict";

const {
  createproducts,
  getproducts,
  getproductsById,
  updateproducts,
  deleteproducts,
} = require("./src/controllers/products");

const moment = require("moment-timezone");

exports.handler = async (products /*, context */) => {
  const { resource, path, httpMethod } = products;
  let response = {
    statusCode: 200,
    body: {},
  };
  const fullPath = `${httpMethod} ${resource}`;
  const { id } = products.pathParameters || {};

  const now = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");

  try {
    switch (fullPath) {
      case "GET /":
        response.body = {
          message: "products API",
          version: "1.0.0",
          currentDateTime: now,
        };
        break;

      case "POST /products":
        response = await createproducts(JSON.parse(products.body));
        break;

      case "GET /products":
        const queryParameters = products.queryStringParameters;
        const nameFilter = queryParameters && queryParameters.name;
        const dateFilter = queryParameters && queryParameters.date;

        response = await getproducts(products, nameFilter, dateFilter);
        break;

      case "GET /products/{id}":
        response = await getproductsById(id);
        break;

      case "PUT /products/{id}":
        const body = JSON.parse(products.body);
        response = await updateproducts({ ...body, id });
        break;

      case "DELETE /products/{id}":
        response = await deleteproducts(id);
        break;

      default:
        response.statusCode = 404;
        response.body = {
          message: "Not Found",
          input: `${httpMethod} ${resource}`,
        };
        break;
    }
  } catch (error) {
    console.log(error);
    response.statusCode = 405;
    response.body = {
      message: "Not Allowed",
      input: `${httpMethod} ${resource}`,
    };
  }

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
