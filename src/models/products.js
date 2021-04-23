const db = require('../helpers/db')

exports.addProduct = (data = {}, cb) => {
    return new Promise((resolve, reject) => {
        db.query(`
      INSERT INTO product
      (${Object.keys(data).join()})
      VALUES
      (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

exports.updateProduct = (id, data) => {
    return new Promise((resolve, reject) => {
        const key = Object.keys(data)
        const value = Object.values(data)
        const q = db.query(`
      UPDATE product
      SET ${key.map((item, index) => `${item}="${value[index]}"`)}
      WHERE id=${id}
        `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
        console.log(q.sql, 'ini kuerynya')
    })
}

exports.getProductCondition = (cond) => {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT * FROM product WHERE ${Object.keys(cond).map(item => `${item}="${cond[item]}"`).join(' AND ')}
        `, (err, res, field) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}


exports.getAllProducts = (cond) => {
    return new Promise((resolve, reject) => {
        db.query(`
        SELECT * FROM
          product WHERE name LIKE "%${cond.search}%"
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
        product WHERE name LIKE "%${cond.search}%"
        `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
     const q =  db.query(`
      DELETE FROM product
      WHERE id='${id}'
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
      console.log(q.sql);
    })
  }