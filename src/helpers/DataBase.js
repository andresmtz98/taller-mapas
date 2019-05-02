import { openDatabase } from 'react-native-sqlite-storage';

export default class DataBase {
    constructor(nombreBd) {
        this.db = openDatabase(`${nombreBd}.db`);
    }

    createTable = async () => {
        this.db.executeSql("DROP TABLE IF EXISTS Sitios;")
        this.db.executeSql(
            "CREATE TABLE IF NOT EXISTS Sitios ( \
                sitio_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
                latitud REAL, \
                longitud REAL, \
                nombre TEXT \
            );"
        );        
    }

    insertSitio = async (db, sitio) => {
        let results = null;
        await db.transaction(t => {
            t.executeSql("INSERT INTO Sitios (nombre, latitud, longitud) VALUES \
            (?,?,?);", [sitio.nombre, sitio.latitud, sitio.longitud],
                (t, resultSet) => {
                    results = resultSet;
                })
        });
        return results;
    }

    listSitios = async db => (
        db.executeSql(
            "SELECT * FROM Sitios;"
        )
    )
    
}