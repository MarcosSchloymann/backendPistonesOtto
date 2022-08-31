const async = require('hbs/lib/async');
var pool = require('./bd');

async function getSeguimientos() {
    var query = 'select id, numero, case estado when 1 then "En espera de fabricación" when 2 then "En fabricación" when 3 then "Producto terminado" when 4 then "Producto despachado" end as estado, comentario from seguimientos';
    var rows = await pool.query(query);
    return rows;
}

async function insertSeguimiento(obj) {
    try {
        var query = "insert into seguimientos set ?";
        var rows = await pool.query(query, [obj]);
        return rows;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function getSeguimientoById(id) {
    var query = 'select * from seguimientos where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function deleteSeguimientosById(id) {
    var query = 'delete from seguimientos where id=?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function modificarSeguimientoById(obj, id) {
    try{
        var query = 'update seguimientos set ? where id=?';
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error){
        throw error;
    }
}





module.exports = { getSeguimientos, insertSeguimiento, deleteSeguimientosById, getSeguimientoById, modificarSeguimientoById }