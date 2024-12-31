const fs = require('fs');
const path = require('path');
const loggerMiddleware = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] Ruta consultada: ${req.method} ${req.url}\n`;

  const logFilePath = path.join(__dirname, 'reportes.log');
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error escribiendo el reporte:", err);
    }
  });

  console.log(logMessage.trim()); 
  next(); 
};

module.exports = {loggerMiddleware}