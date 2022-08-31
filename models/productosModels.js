const async = require('hbs/lib/async');
var pool = require('./bd');

async function getProductos() {
    var query = 'select * from productos';
    var rows = await pool.query(query);
    return rows;
}

async function insertProducto(obj) {
    try {
        var query = "insert into productos set ?";
        var rows = await pool.query(query, [obj])
        return rows;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteProductosById(id) {
    var query = 'delete from productos where id=?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getProductoById(id) {
    var query = 'select * from productos where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function modificarProductoById(obj, id) {
    try{
        var query = 'update productos set ? where id=?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error){
        throw error;
    }
}


module.exports = { getProductos, insertProducto, deleteProductosById, getProductoById, modificarProductoById }