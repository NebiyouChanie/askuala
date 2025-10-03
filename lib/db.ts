import mysql from 'mysql2/promise'

type QueryParam = string | number | boolean | null | Date

let pool: mysql.Pool

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tes',
      port: Number(process.env.DB_PORT || 3306),
      connectionLimit: 10,
    })
  }
  return pool
}

export async function query<T = any>(sql: string, params: QueryParam[] = []): Promise<T[]> {
  try {
    const [rows] = await getPool().execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function queryOne<T = any>(sql: string, params: QueryParam[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length ? rows[0] : null
}

export async function execute(sql: string, params: QueryParam[] = []): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params)
  return result as mysql.ResultSetHeader
}

// Prisma-like helpers (very small subset)

type Where = Record<string, QueryParam>
type Data = Record<string, QueryParam>

function buildWhere(where?: Where) {
  if (!where || Object.keys(where).length === 0) return { clause: '', params: [] as QueryParam[] }
  const keys = Object.keys(where)
  const clause = 'WHERE ' + keys.map((k) => `\`${k}\` = ?`).join(' AND ')
  const params = keys.map((k) => where[k])
  return { clause, params }
}

export async function findMany<T = any>(table: string, where?: Where): Promise<T[]> {
  const { clause, params } = buildWhere(where)
  const sql = `SELECT * FROM \`${table}\` ${clause}`
  return query<T>(sql, params)
}

export async function findOne<T = any>(table: string, where: Where): Promise<T | null> {
  const { clause, params } = buildWhere(where)
  const sql = `SELECT * FROM \`${table}\` ${clause} LIMIT 1`
  return queryOne<T>(sql, params)
}

export async function create<T = any>(table: string, data: Data): Promise<mysql.ResultSetHeader> {
  const keys = Object.keys(data)
  const placeholders = keys.map(() => '?').join(', ')
  const sql = `INSERT INTO \`${table}\` (${keys.map((k) => `\`${k}\``).join(', ')}) VALUES (${placeholders})`
  const params = keys.map((k) => data[k])
  return execute(sql, params)
}

export async function update<T = any>(table: string, where: Where, data: Data): Promise<mysql.ResultSetHeader> {
  const setKeys = Object.keys(data)
  const setClause = setKeys.map((k) => `\`${k}\` = ?`).join(', ')
  const setParams = setKeys.map((k) => data[k])

  const { clause, params: whereParams } = buildWhere(where)
  const sql = `UPDATE \`${table}\` SET ${setClause} ${clause}`
  return execute(sql, [...setParams, ...whereParams])
}

export async function remove(table: string, where: Where): Promise<mysql.ResultSetHeader> {
  const { clause, params } = buildWhere(where)
  const sql = `DELETE FROM \`${table}\` ${clause}`
  console.log("🚀 ~ findMany ~ sql:", sql)
  console.log("🚀 ~ findOne ~ sql:", sql)
  console.log("🚀 ~ findOne ~ sql:", sql)
  console.log("🚀 ~ findOne ~ sql:", sql)
  return execute(sql, params)
}


