const validateRequired = (events, requiredProperties) => {
  const missingRequired = requiredProperties.filter(
    (property) => !(property in events)
  );
  if (missingRequired.length > 0) {
    return {
      body: {
        message: "Faltan propiedades obligatorias en la solicitud",
      },
      statusCode: 400,
    };
  }

  return null;
};

const validateUnknown = (events, requiredProperties, optionalProperties) => {
  const unknownProperties = Object.keys(events).filter(
    (property) =>
      ![...requiredProperties, ...optionalProperties].includes(property)
  );

  if (unknownProperties.length > 0) {
    return {
      body: {
        message: "Propiedades desconocidas en la solicitud",
      },
      statusCode: 400,
    };
  }

  return null;
};

module.exports = {
  validateRequired,
  validateUnknown,
};
