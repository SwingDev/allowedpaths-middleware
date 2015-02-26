# allowedpaths-middleware

_        = require('lodash')
traverse = require('traverse')


module.exports = AllowedPaths = (arrAllowedPaths) ->
  (req, res, next) ->
    unless arrAllowedPaths or arrAllowedPaths.length or _.isArray arrAllowedPaths
      throw new Error 'Array of allowed paths is required'

    arrAllowedPathsSplit = _.map arrAllowedPaths, (allowedPath) -> allowedPath.split '.'
    arrAllowedPathsVals  = _.map arrAllowedPathsSplit, (components) -> traverse(req.body).get(components) ? traverse(req.body).get(components)

    allowedParams = _.zipObject arrAllowedPaths, arrAllowedPathsVals
    allowedParams = _.pick allowedParams, (param) -> param?

    req.allowedParams = allowedParams

    next()
