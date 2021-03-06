const db = require('../helpers/db')

exports.getUsersByCondition = (cond) => {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT * FROM users WHERE ${Object.keys(cond).map(item => `${item}="${cond[item]}"`).join(' AND ')}
        `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

exports.createUser = (data = {}) => {
    return new Promise((resolve, reject) => {
        db.query(`
      INSERT INTO users
      (${Object.keys(data).join()})
      VALUES
      (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`
      SELECT * FROM users WHERE id=${id}
      `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

exports.getAllUsers = (cond) => {
    return new Promise((resolve, reject) => {
        db.query(`
        SELECT * FROM
          users WHERE name LIKE "%${cond.search}%"
          ORDER BY ${cond.sort} ${cond.order}
          LIMIT ${cond.limit} OFFSET ${cond.offset}
        `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

exports.totalData = (cond) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM
        users WHERE name LIKE "%${cond.search}%"
        `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }