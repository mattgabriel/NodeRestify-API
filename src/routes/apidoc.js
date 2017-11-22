/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

/**
 * @apiDefine AuthHeader
 *
 * @apiHeader {String} TOKEN User Access Token.
 */

 /**
 * @apiDefine admin
 *
 * Admin (Role 900)
 */

  /**
 * @apiDefine coach
 *
 * Coach (Role 200)
 */

  /**
 * @apiDefine player
 *
 * Player (Role 100)
 */

/**
 * @apiDefine pipeline
 *
 * Coach (Role 1000)
 */