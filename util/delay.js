/**
 * 
 * @param {Number} ms 
 */
module.exports = ms => new Promise(async(resolve) => setTimeout(await resolve, ms))