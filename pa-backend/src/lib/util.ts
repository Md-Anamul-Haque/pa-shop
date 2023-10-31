import { Client } from "pg";

export async function insertJSONArrayIntoJSONColumn(client: Client, tableName: string, columnNames: string[], jsonArrayData: any[]) {
    const keys = Object.keys(columnNames)
    const values = jsonArrayData.map(data => {
        let value: any;
        keys.forEach(key => {
            value[key] = data[key]
        });
        return value
    })
    let rows: any;
    try {
        const result = await client.query(`INSERT INTO ${tableName} (${keys.join(',')}) VALUES %L`, [values]);
        rows = result.rows
    } finally {
        return rows
    }
}
