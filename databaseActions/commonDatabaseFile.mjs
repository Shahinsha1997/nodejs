import { LAB_DB, MED_DB, MOVIE_DB, MOV_ACC, USER_DB } from "../utils/commonUtil.mjs";
import { getJMovAcc, getJMovDB, getLabManagementDB, getMedManagementAcc, getUserManagementDB } from "../utils/dbUtils.mjs";

export default class QueryBuilder {
    constructor(dbType) {
      this.db = dbType
    }
    async closeDB(){
      const db = await this.getDb()
      return await db.close();
    }
    async getDb(){
        const dbObj = {
            [MOVIE_DB]: async ()=> await getJMovDB(),
            [LAB_DB] : async ()=> await getLabManagementDB(),
            [MED_DB]: async ()=> await getMedManagementAcc(),
            [USER_DB] : async ()=> await getUserManagementDB(),
            [MOV_ACC] : async ()=> await getJMovAcc()
          }
        return dbObj[this.db]();
    }
    async select({
      fields,
      tableName,
      joins,
      condition,
      groupBy,
      having,
      orderBy,
      limit,
      offset,
    }) {
      const db = await this.getDb()
      if (!fields || !tableName) {
        throw new Error("Missing required fields: 'fields' or 'tableName'.");
      }
  
      let query = `SELECT ${fields.join(", ")} FROM ${tableName}`;
  
      // Handle JOINs
      if (joins && Array.isArray(joins)) {
        joins.forEach(({ type = "INNER", table, on }) => {
          if (!table || !on) throw new Error("Invalid JOIN definition.");
          query += ` ${type.toUpperCase()} JOIN ${table} ON ${on}`;
        });
      }
  
      // Handle WHERE condition
      if (condition) {
        query += ` WHERE ${condition}`;
      }
  
      // Handle GROUP BY clause
      if (groupBy) {
        query += ` GROUP BY ${groupBy.join(", ")}`;
      }
  
      // Handle HAVING clause
      if (having) {
        query += ` HAVING ${having}`;
      }
  
      // Handle ORDER BY clause
      if (orderBy) {
        query += ` ORDER BY ${orderBy}`;
      }
  
      // Handle LIMIT and OFFSET
      if (limit) {
        query += ` LIMIT ${limit}`;
      }
      if (offset) {
        query += ` OFFSET ${offset}`;
      }
  
      console.log("Executing SELECT query:", query);
      const result = await db.execute(query)
      return result.rows;
    }
  
    async create({ tableName, data }) {
      const db = await this.getDb()
      if (!tableName || !data || typeof data !== "object") {
        throw new Error("Missing required fields: 'tableName' or 'data'.");
      }
  
      const columns = Object.keys(data).join(", ");
      const values = Object.values(data)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(", ");
  
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
  
      console.log("Executing CREATE query:", query);
      return db.execute(query);
    }
  
    async update({ tableName, data, condition, values }) {
        const db = await this.getDb()
      if (!tableName || !condition) {
        throw new Error("Missing required fields: 'tableName', 'data', or 'condition'.");
      }
  
      const updates = data ? Object.entries(data)
        .map(([key, value]) => `${key} = ${typeof value === "string" ? `'${value}'` : value}`)
        .join(", ") : values;
  
      const query = `UPDATE ${tableName} SET ${updates} WHERE ${condition}`;
  
      console.log("Executing UPDATE query:", query);
      return db.execute(query);
    }
  
    async delete({ tableName, condition }) {
      const db = await this.getDb()
      if (!tableName || !condition) {
        throw new Error("Missing required fields: 'tableName' or 'condition'.");
      }
  
      const query = `DELETE FROM ${tableName} WHERE ${condition}`;
  
      console.log("Executing DELETE query:", query);
      return db.execute(query);
    }
    async usage(dbName){
        const db = await this.getDb()
        return db.databases.usage(dbName);
    }
  }
  

//   const result = await queryBuilder.select({
//     fields: ["users.id", "users.name", "COUNT(orders.id) as orderCount"],
//     tableName: "users",
//     joins: [{ type: "LEFT", table: "orders", on: "users.id = orders.user_id" }],
//     condition: "users.age > 18",
//     groupBy: ["users.id", "users.name"],
//     having: "orderCount > 2",
//     orderBy: "users.name ASC",
//     limit: 10,
//     offset: 0,
//   });