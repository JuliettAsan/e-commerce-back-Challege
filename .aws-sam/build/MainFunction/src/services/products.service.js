const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = "products-ecommerce";

module.exports = {
  create: async (products) => {
    const params = {
      TableName: tableName,
      Item: products,
    };
    return dynamoDb.put(params).promise();
  },

  getAllproducts: async () => {
    const params = {
      TableName: tableName,
    };

    const result = await dynamoDb.scan(params).promise();

    return {
      Items: result.Items,
      Total: result.Count,
    };
  },

  getById: async (id) => {
    const params = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
  },

  updateById: async (id, allowedFields) => {
    delete allowedFields.owner;
    delete allowedFields.id;
    delete allowedFields.creationAt;

    const params = {
      TableName: tableName,
      Key: {
        id: id,
      },
      UpdateExpression: "set",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
    };

    for (const field in allowedFields) {
      params.UpdateExpression += ` #${field} = :${field},`;
      params.ExpressionAttributeNames[`#${field}`] = field;
      params.ExpressionAttributeValues[`:${field}`] = allowedFields[field];
    }

    params.UpdateExpression = params.UpdateExpression.slice(0, -1);

    return dynamoDb.update(params).promise();
  },

  deleteById: async (id) => {
    const params = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    return dynamoDb.delete(params).promise();
  },
};
