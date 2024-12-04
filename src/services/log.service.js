const { logAxios } = require('../config/axios');

/**
 *
 * @param {{
 * name: string;
 * type: string;
 * created_by: string;
 * ref_type?: string;
 * ref_id?: string;
 * parent_id?: string
 * project_id?: string
 * image?: string
 * description?: string
 * origin?: string
 * }} message
 * @returns
 */
const createLog = async (message) => {
  return (await logAxios.post('/', message)).data;
};

module.exports = {
  createLog,
};
