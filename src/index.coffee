# allowedpaths-middleware
_             = require('lodash')
traverse      = require('traverse')
ErrorHandler  = require('error-handler')


AllowedPaths = (arrAllowedPaths) ->
  (req, res, next) ->
    req.allowedParams = _pickAllowedPaths arrAllowedPaths, req
    next()

AllowedPathsRoles = (objAllowedPaths, {userFieldName, userRolesFieldName} = {}) ->
  (req, res, next) ->
    unless objAllowedPaths and (_.keys objAllowedPaths).length and _.isPlainObject objAllowedPaths
      throw new Error 'Dict of allowed paths for roles is required'

    userFieldName      ?= 'user'
    userRolesFieldName ?= 'roles'

    pathToUser = userFieldName.split '.'
    unless traverse(req).has(pathToUser)
      throw new Error "There is no #{userFieldName} in req"

    objUser = traverse(req).get(pathToUser)

    pathToRoles = _.union ['_doc'], userRolesFieldName.split '.'
    if traverse(objUser).has pathToRoles
      userRolesField = traverse(objUser).get(pathToRoles)
    else if _.isFunction objUser[userRolesFieldName]
      userRolesField = objUser[userRolesFieldName]()

    unless _.isArray userRolesField
      throw new Error 'User roles field must contain array of roles'

    allowedRoles = _.intersection userRolesField, _.keys objAllowedPaths

    unless allowedRoles? and allowedRoles.length
      return next(new ErrorHandler.PrivilagesError "You don't have privilages")

    for strRole, arrAllowedPaths of objAllowedPaths
      if strRole in allowedRoles
        req.allowedParams ?= {}
        req.allowedParams = _.assign req.allowedParams, _pickAllowedPaths(arrAllowedPaths, req)

    next()

_pickAllowedPaths = (arrAllowedPaths, reqObj) ->
  unless arrAllowedPaths and arrAllowedPaths.length and _.isArray arrAllowedPaths
    throw new Error 'Array of allowed paths is required'

  arrAllowedPathsSplit = _.map arrAllowedPaths, (allowedPath) -> allowedPath.split '.'
  arrAllowedPathsVals  = _.map arrAllowedPathsSplit, (components) -> traverse(reqObj.body).get(components) ? traverse(reqObj.body).get(components)

  allowedParams = _.zipObject arrAllowedPaths, arrAllowedPathsVals
  allowedParams = _.pick allowedParams, (param) -> typeof param isnt "undefined"

  allowedParams


module.exports =
  AllowedPaths: AllowedPaths
  AllowedPathsRoles: AllowedPathsRoles