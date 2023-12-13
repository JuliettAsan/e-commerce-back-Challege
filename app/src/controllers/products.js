const {
  create,
  getAllproducts,
  getById,
  updateById,
  deleteById,
} = require("../services/products.service");

const {
  requiredProperties,
  optionalProperties,
} = require("../utils/constants");

const moment = require("moment-timezone");

const { v4: uuidv4 } = require("uuid");

function generarId() {
  const uuid = uuidv4();
  const shortID = uuid.replace(/-/g, "").substring(0, 5);
  return shortID;
}

module.exports = {
  //Crear productso

  createproducts: async (products) => {
    try {
      const id = generarId();
      const creationAt = moment()
        .tz("America/Bogota")
        .format("YYYY-MM-DD HH:mm:ss");

      await create({ ...products, id, creationAt });

      return {
        body: {
          message: "El producto se ha registrado exitosamente",
          id: id,
        },
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      return {
        body: {
          message: "Error al crear el producto",
        },
        statusCode: 500,
      };
    }
  },

  //Obtener lista de productos

  getproducts: async (products, nameFilter, dateFilter) => {
    try {
      const queryParams = products.queryStringParameters;
      const page =
        queryParams && queryParams.page ? parseInt(queryParams.page) : 1;
      const offset =
        queryParams && queryParams.offset ? parseInt(queryParams.offset) : 10;

      let result = await getAllproducts();

      let totalEntries = result.Total;
      let filteredproducts = result.Items;

      if (nameFilter || dateFilter) {
        filteredproducts = result.Items.filter((products) => {
          const productsName = nameFilter
            ? products.name.toLowerCase().startsWith(nameFilter.toLowerCase())
            : true;
          const productsDate = dateFilter
            ? products.startDate
                .toLowerCase()
                .startsWith(dateFilter.toLowerCase())
            : true;
          return productsName && productsDate;
        });

        totalEntries = filteredproducts.length;
      }

      filteredproducts.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );

      const startIndex = (page - 1) * offset;
      const endIndex = Math.min(startIndex + offset, totalEntries);
      const resultproducts = filteredproducts.slice(startIndex, endIndex);

      if (resultproducts.length > 0) {
        return {
          body: {
            data: resultproducts,
            totalEntries,
          },
          statusCode: 200,
        };
      } else {
        return {
          body: {
            message: "No se encontraron productos",
          },
          statusCode: 404,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        body: {
          message: "Error al obtener productos",
        },
        statusCode: 500,
      };
    }
  },

  //Obtener producto especifico por ID

  getproductsById: async (id) => {
    try {
      const result = await getById(id);
      if (result && result.id) {
        return {
          body: {
            data: result,
          },
          statusCode: 200,
        };
      } else {
        return {
          body: {
            message: "No se encontró el producto",
          },
          statusCode: 404,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        body: {
          message: "Error al obtener producto",
        },
        statusCode: 500,
      };
    }
  },

  //Actualizar productso

  updateproducts: async (products) => {
    try {
      const { id, ...fieldsToUpdate } = products;

      await updateById(id, fieldsToUpdate);

      return {
        body: {
          message: "productso actualizado",
        },
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        body: {
          message: "Error al actualizar el producto",
        },
        statusCode: 500,
      };
    }
  },

  //Eliminar productso

  deleteproducts: async (id) => {
    try {
      const existingproducts = await getById(id);

      if (existingproducts == null) {
        return {
          statusCode: 404,
          body: {
            message: "productso no encontrado, el ID proporcionado no existe",
          },
        };
      }

      await deleteById(id);

      return {
        statusCode: 200,
        body: {
          message: "producto eliminado",
        },
      };
    } catch (error) {
      console.error(error);
      return {
        body: {
          message: "Error al eliminar el producto",
        },
        statusCode: 500,
      };
    }
  },
};
