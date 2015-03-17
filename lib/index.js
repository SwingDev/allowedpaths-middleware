var AllowedPaths, AllowedPathsRoles, ErrorHandler, _, _pickAllowedPaths, traverse,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('lodash');

traverse = require('traverse');

ErrorHandler = require.main.require('error-handler');

AllowedPaths = function(arrAllowedPaths) {
  return function(req, res, next) {
    req.allowedParams = _pickAllowedPaths(arrAllowedPaths, req);
    return next();
  };
};

AllowedPathsRoles = function(objAllowedPaths, arg) {
  var ref, userFieldName, userRolesFieldName;
  ref = arg != null ? arg : {}, userFieldName = ref.userFieldName, userRolesFieldName = ref.userRolesFieldName;
  return function(req, res, next) {
    var allowedRoles, arrAllowedPaths, objUser, pathToRoles, pathToUser, strRole, userRolesField;
    if (!(objAllowedPaths && (_.keys(objAllowedPaths)).length && _.isPlainObject(objAllowedPaths))) {
      throw new Error('Dict of allowed paths for roles is required');
    }
    if (userFieldName == null) {
      userFieldName = 'user';
    }
    if (userRolesFieldName == null) {
      userRolesFieldName = 'roles';
    }
    pathToUser = userFieldName.split('.');
    if (!traverse(req).has(pathToUser)) {
      throw new Error("There is no " + userFieldName + " in req");
    }
    objUser = traverse(req).get(pathToUser);
    pathToRoles = _.union(['_doc'], userRolesFieldName.split('.'));
    if (traverse(objUser).has(pathToRoles)) {
      userRolesField = traverse(objUser).get(pathToRoles);
    } else if (_.isFunction(objUser[userRolesFieldName])) {
      userRolesField = objUser[userRolesFieldName]();
    }
    if (!_.isArray(userRolesField)) {
      throw new Error('User roles field must contain array of roles');
    }
    allowedRoles = _.intersection(userRolesField, _.keys(objAllowedPaths));
    if (!((allowedRoles != null) && allowedRoles.length)) {
      return next(new ErrorHandler.PrivilagesError("You don't have privilages"));
    }
    for (strRole in objAllowedPaths) {
      arrAllowedPaths = objAllowedPaths[strRole];
      if (indexOf.call(allowedRoles, strRole) >= 0) {
        if (req.allowedParams == null) {
          req.allowedParams = {};
        }
        req.allowedParams = _.assign(req.allowedParams, _pickAllowedPaths(arrAllowedPaths, req));
      }
    }
    return next();
  };
};

_pickAllowedPaths = function(arrAllowedPaths, reqObj) {
  var allowedParams, arrAllowedPathsSplit, arrAllowedPathsVals;
  if (!(arrAllowedPaths && arrAllowedPaths.length && _.isArray(arrAllowedPaths))) {
    throw new Error('Array of allowed paths is required');
  }
  arrAllowedPathsSplit = _.map(arrAllowedPaths, function(allowedPath) {
    return allowedPath.split('.');
  });
  arrAllowedPathsVals = _.map(arrAllowedPathsSplit, function(components) {
    var ref;
    return (ref = traverse(reqObj.body).get(components)) != null ? ref : traverse(reqObj.body).get(components);
  });
  allowedParams = _.zipObject(arrAllowedPaths, arrAllowedPathsVals);
  allowedParams = _.pick(allowedParams, function(param) {
    return typeof param !== "undefined";
  });
  return allowedParams;
};

module.exports = {
  AllowedPaths: AllowedPaths,
  AllowedPathsRoles: AllowedPathsRoles
};

//# sourceMappingURL=data:application/json;base64,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LE1BQUEsQ0FBQSxLQUFBLEtBQWtCLFlBQTdCO0VBQUEsQ0FBdEIsQ0FQaEIsQ0FBQTtTQVNBLGNBVmtCO0FBQUEsQ0E3Q3BCLENBQUE7O0FBQUEsTUEwRE0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFlBQUEsRUFBYyxZQUFkO0FBQUEsRUFDQSxpQkFBQSxFQUFtQixpQkFEbkI7Q0EzREYsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMgYWxsb3dlZHBhdGhzLW1pZGRsZXdhcmVcbl8gICAgICAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKVxudHJhdmVyc2UgICAgICA9IHJlcXVpcmUoJ3RyYXZlcnNlJylcbkVycm9ySGFuZGxlciAgPSByZXF1aXJlLm1haW4ucmVxdWlyZSgnZXJyb3ItaGFuZGxlcicpXG5cblxuQWxsb3dlZFBhdGhzID0gKGFyckFsbG93ZWRQYXRocykgLT5cbiAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHJlcS5hbGxvd2VkUGFyYW1zID0gX3BpY2tBbGxvd2VkUGF0aHMgYXJyQWxsb3dlZFBhdGhzLCByZXFcbiAgICBuZXh0KClcblxuQWxsb3dlZFBhdGhzUm9sZXMgPSAob2JqQWxsb3dlZFBhdGhzLCB7dXNlckZpZWxkTmFtZSwgdXNlclJvbGVzRmllbGROYW1lfSA9IHt9KSAtPlxuICAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdW5sZXNzIG9iakFsbG93ZWRQYXRocyBhbmQgKF8ua2V5cyBvYmpBbGxvd2VkUGF0aHMpLmxlbmd0aCBhbmQgXy5pc1BsYWluT2JqZWN0IG9iakFsbG93ZWRQYXRoc1xuICAgICAgdGhyb3cgbmV3IEVycm9yICdEaWN0IG9mIGFsbG93ZWQgcGF0aHMgZm9yIHJvbGVzIGlzIHJlcXVpcmVkJ1xuXG4gICAgdXNlckZpZWxkTmFtZSAgICAgID89ICd1c2VyJ1xuICAgIHVzZXJSb2xlc0ZpZWxkTmFtZSA/PSAncm9sZXMnXG5cbiAgICBwYXRoVG9Vc2VyID0gdXNlckZpZWxkTmFtZS5zcGxpdCAnLidcbiAgICB1bmxlc3MgdHJhdmVyc2UocmVxKS5oYXMocGF0aFRvVXNlcilcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIlRoZXJlIGlzIG5vICN7dXNlckZpZWxkTmFtZX0gaW4gcmVxXCJcblxuICAgIG9ialVzZXIgPSB0cmF2ZXJzZShyZXEpLmdldChwYXRoVG9Vc2VyKVxuXG4gICAgcGF0aFRvUm9sZXMgPSBfLnVuaW9uIFsnX2RvYyddLCB1c2VyUm9sZXNGaWVsZE5hbWUuc3BsaXQgJy4nXG4gICAgaWYgdHJhdmVyc2Uob2JqVXNlcikuaGFzIHBhdGhUb1JvbGVzXG4gICAgICB1c2VyUm9sZXNGaWVsZCA9IHRyYXZlcnNlKG9ialVzZXIpLmdldChwYXRoVG9Sb2xlcylcbiAgICBlbHNlIGlmIF8uaXNGdW5jdGlvbiBvYmpVc2VyW3VzZXJSb2xlc0ZpZWxkTmFtZV1cbiAgICAgIHVzZXJSb2xlc0ZpZWxkID0gb2JqVXNlclt1c2VyUm9sZXNGaWVsZE5hbWVdKClcblxuICAgIHVubGVzcyBfLmlzQXJyYXkgdXNlclJvbGVzRmllbGRcbiAgICAgIHRocm93IG5ldyBFcnJvciAnVXNlciByb2xlcyBmaWVsZCBtdXN0IGNvbnRhaW4gYXJyYXkgb2Ygcm9sZXMnXG5cbiAgICBhbGxvd2VkUm9sZXMgPSBfLmludGVyc2VjdGlvbiB1c2VyUm9sZXNGaWVsZCwgXy5rZXlzIG9iakFsbG93ZWRQYXRoc1xuXG4gICAgdW5sZXNzIGFsbG93ZWRSb2xlcz8gYW5kIGFsbG93ZWRSb2xlcy5sZW5ndGhcbiAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvckhhbmRsZXIuUHJpdmlsYWdlc0Vycm9yIFwiWW91IGRvbid0IGhhdmUgcHJpdmlsYWdlc1wiKVxuXG4gICAgZm9yIHN0clJvbGUsIGFyckFsbG93ZWRQYXRocyBvZiBvYmpBbGxvd2VkUGF0aHNcbiAgICAgIGlmIHN0clJvbGUgaW4gYWxsb3dlZFJvbGVzXG4gICAgICAgIHJlcS5hbGxvd2VkUGFyYW1zID89IHt9XG4gICAgICAgIHJlcS5hbGxvd2VkUGFyYW1zID0gXy5hc3NpZ24gcmVxLmFsbG93ZWRQYXJhbXMsIF9waWNrQWxsb3dlZFBhdGhzKGFyckFsbG93ZWRQYXRocywgcmVxKVxuXG4gICAgbmV4dCgpXG5cbl9waWNrQWxsb3dlZFBhdGhzID0gKGFyckFsbG93ZWRQYXRocywgcmVxT2JqKSAtPlxuICB1bmxlc3MgYXJyQWxsb3dlZFBhdGhzIGFuZCBhcnJBbGxvd2VkUGF0aHMubGVuZ3RoIGFuZCBfLmlzQXJyYXkgYXJyQWxsb3dlZFBhdGhzXG4gICAgdGhyb3cgbmV3IEVycm9yICdBcnJheSBvZiBhbGxvd2VkIHBhdGhzIGlzIHJlcXVpcmVkJ1xuXG4gIGFyckFsbG93ZWRQYXRoc1NwbGl0ID0gXy5tYXAgYXJyQWxsb3dlZFBhdGhzLCAoYWxsb3dlZFBhdGgpIC0+IGFsbG93ZWRQYXRoLnNwbGl0ICcuJ1xuICBhcnJBbGxvd2VkUGF0aHNWYWxzICA9IF8ubWFwIGFyckFsbG93ZWRQYXRoc1NwbGl0LCAoY29tcG9uZW50cykgLT4gdHJhdmVyc2UocmVxT2JqLmJvZHkpLmdldChjb21wb25lbnRzKSA/IHRyYXZlcnNlKHJlcU9iai5ib2R5KS5nZXQoY29tcG9uZW50cylcblxuICBhbGxvd2VkUGFyYW1zID0gXy56aXBPYmplY3QgYXJyQWxsb3dlZFBhdGhzLCBhcnJBbGxvd2VkUGF0aHNWYWxzXG4gIGFsbG93ZWRQYXJhbXMgPSBfLnBpY2sgYWxsb3dlZFBhcmFtcywgKHBhcmFtKSAtPiB0eXBlb2YgcGFyYW0gaXNudCBcInVuZGVmaW5lZFwiXG5cbiAgYWxsb3dlZFBhcmFtc1xuXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgQWxsb3dlZFBhdGhzOiBBbGxvd2VkUGF0aHNcbiAgQWxsb3dlZFBhdGhzUm9sZXM6IEFsbG93ZWRQYXRoc1JvbGVzIl19