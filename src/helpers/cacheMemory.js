'use strict'

/**
 * @file cacheMemory.js File help with the cache memory for some resources.
 * @author Eladio Rocha Vizcaino
 */

/**
* File help with the cache memory for some resources.
* @module helpers/cacheMemory
* @requires memory-cache
*/

const cache = require('memory-cache'),
  memCache = new cache.Cache()

module.exports = {
  cacheMiddleware
}

/**
 * @todo Write documentation and refactor code.
 */
function cacheMiddleware(duration) {
  try {
    const duaration = parseInt(process.env.CACHE_DURATION),
      key = '__express__' + req.url,
      cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        memCache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  } catch (error) {
    console.error(`A cache error has occurred --> ${error.toString()}`)
  }

}