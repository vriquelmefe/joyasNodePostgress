const express = require('express')
const { loggerMiddleware } = require("./middleware/logger");
const app = express()
app.listen(3000, console.log("¡Servidor encendido!"))

const { getJewerly, getJewerlybyFilter} = require('./consultas')
app.use(loggerMiddleware)
app.get("/joyas", async (req, res) => {
  try {
    const joyas = await getJewerly(req.query); 
    res.status(200).json(joyas); 
  } catch (error) {
    console.error("Error en la ruta /joyas:", error.message);
    res.status(500).json({ error: "Error al obtener las joyas" }); 
  }
});
app.get("/joyas/filtros", async (req, res) => {
  try {
    const queryStrings = req.query; 
    const joyas = await getJewerlybyFilter(queryStrings);
    res.status(200).json(joyas); 
  } catch (error) {
    console.error("Error en la ruta /joyas/filtros:", error.message);
    res.status(500).json({ error: "Error obteniendo las joyas con filtros" }); 
  }
});