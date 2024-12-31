const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "12345",
    database: "joyas",
    port: 5433,
    allowExitOnIdle: true
});
const getJewerly = async ({ limit = 3, page = 1, order_by = "stock_ASC" }) => {
  const [campo, direccion] = order_by.split("_");
  const offset = Math.abs((page - 1) * limit);
  
  const formattedQuery = format(
    "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
    campo,
    direccion.toUpperCase(),
    limit,
    offset
  );

  try {
    const { rows } = await pool.query(formattedQuery);
    const countQuery = "SELECT COUNT(*) AS total FROM inventario";
    const { rows: countRows } = await pool.query(countQuery);
    const totalItems = parseInt(countRows[0].total, 10);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      total: rows.length,
      page,
      totalPages,
      results: rows.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        stock: item.stock,
        links: [
          {
            rel: "self",
            href: `/joyas/${item.id}`,
            method: "GET",
          },
          {
            rel: "update",
            href: `/joyas/${item.id}`,
            method: "PUT",
          },
          {
            rel: "delete",
            href: `/joyas/${item.id}`,
            method: "DELETE",
          },
        ],
      }))
    };
  } catch (error) {
    console.error("Error obteniendo joyas:", error.message);
    throw error;
  }
};
  
const getJewerlybyFilter = async ({
    precio_min,
    precio_max,
    categoria,
    metal,
  }) => {
    let filtros = [];
    const values = [];
    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    };
    if (precio_min) agregarFiltro("precio", ">=", precio_min);
    if (precio_max) agregarFiltro("precio", "<=", precio_max);
    if (categoria) agregarFiltro("categoria", "=", categoria);
    if (metal) agregarFiltro("metal", "=", metal);
    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }
  
    try {
      const { rows:inventario } = await pool.query(consulta, values);
      return inventario;
    } catch (error) {
      console.error("Error obteniendo joyas por filtros:", error.message);
    }
  };

module.exports = { getJewerly, getJewerlybyFilter}