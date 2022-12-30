import jwt from 'jsonwebtoken';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export async function generateToken(user_id: number) {
  const jwt_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET || 'sadfadfasdfWewe');
  return jwt_token;
}

export class QueryBuilder {
  public static insert = (table, data) => {
    const columns = [];
    const values = [];
    for (var key in data) {
      columns.push(key);
      values.push(`'${data[key]}'`);
    }
    console.log(columns);
    const sql = `insert into ${table}(${columns.join(',')}) values(${values.join(',')})`;
    return sql;
  };

  public static update = (table, data, where = '') => {
    const values = [];
    for (var key in data) {
      values.push(`${key}='${data[key]}'`);
    }
    // console.log(columns);
    const sql = `update ${table} set ${values.join(',')} ${where}`;
    return sql;
  };
}


