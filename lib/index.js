var AllowedPaths, AllowedPathsRoles, ErrorHandler, _, _pickAllowedPaths, traverse,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = require('lodash');

traverse = require('traverse');

ErrorHandler = require('error-handler');

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

//# sourceMappingURL=data:application/json;base64,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WUFBN0I7RUFBQSxDQUF0QixDQVBoQixDQUFBO1NBU0EsY0FWa0I7QUFBQSxDQTdDcEIsQ0FBQTs7QUFBQSxNQTBETSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsWUFBQSxFQUFjLFlBQWQ7QUFBQSxFQUNBLGlCQUFBLEVBQW1CLGlCQURuQjtDQTNERixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyBhbGxvd2VkcGF0aHMtbWlkZGxld2FyZVxuXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpXG50cmF2ZXJzZSAgICAgID0gcmVxdWlyZSgndHJhdmVyc2UnKVxuRXJyb3JIYW5kbGVyICA9IHJlcXVpcmUoJ2Vycm9yLWhhbmRsZXInKVxuXG5cbkFsbG93ZWRQYXRocyA9IChhcnJBbGxvd2VkUGF0aHMpIC0+XG4gIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICByZXEuYWxsb3dlZFBhcmFtcyA9IF9waWNrQWxsb3dlZFBhdGhzIGFyckFsbG93ZWRQYXRocywgcmVxXG4gICAgbmV4dCgpXG5cbkFsbG93ZWRQYXRoc1JvbGVzID0gKG9iakFsbG93ZWRQYXRocywge3VzZXJGaWVsZE5hbWUsIHVzZXJSb2xlc0ZpZWxkTmFtZX0gPSB7fSkgLT5cbiAgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHVubGVzcyBvYmpBbGxvd2VkUGF0aHMgYW5kIChfLmtleXMgb2JqQWxsb3dlZFBhdGhzKS5sZW5ndGggYW5kIF8uaXNQbGFpbk9iamVjdCBvYmpBbGxvd2VkUGF0aHNcbiAgICAgIHRocm93IG5ldyBFcnJvciAnRGljdCBvZiBhbGxvd2VkIHBhdGhzIGZvciByb2xlcyBpcyByZXF1aXJlZCdcblxuICAgIHVzZXJGaWVsZE5hbWUgICAgICA/PSAndXNlcidcbiAgICB1c2VyUm9sZXNGaWVsZE5hbWUgPz0gJ3JvbGVzJ1xuXG4gICAgcGF0aFRvVXNlciA9IHVzZXJGaWVsZE5hbWUuc3BsaXQgJy4nXG4gICAgdW5sZXNzIHRyYXZlcnNlKHJlcSkuaGFzKHBhdGhUb1VzZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgXCJUaGVyZSBpcyBubyAje3VzZXJGaWVsZE5hbWV9IGluIHJlcVwiXG5cbiAgICBvYmpVc2VyID0gdHJhdmVyc2UocmVxKS5nZXQocGF0aFRvVXNlcilcblxuICAgIHBhdGhUb1JvbGVzID0gXy51bmlvbiBbJ19kb2MnXSwgdXNlclJvbGVzRmllbGROYW1lLnNwbGl0ICcuJ1xuICAgIGlmIHRyYXZlcnNlKG9ialVzZXIpLmhhcyBwYXRoVG9Sb2xlc1xuICAgICAgdXNlclJvbGVzRmllbGQgPSB0cmF2ZXJzZShvYmpVc2VyKS5nZXQocGF0aFRvUm9sZXMpXG4gICAgZWxzZSBpZiBfLmlzRnVuY3Rpb24gb2JqVXNlclt1c2VyUm9sZXNGaWVsZE5hbWVdXG4gICAgICB1c2VyUm9sZXNGaWVsZCA9IG9ialVzZXJbdXNlclJvbGVzRmllbGROYW1lXSgpXG5cbiAgICB1bmxlc3MgXy5pc0FycmF5IHVzZXJSb2xlc0ZpZWxkXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ1VzZXIgcm9sZXMgZmllbGQgbXVzdCBjb250YWluIGFycmF5IG9mIHJvbGVzJ1xuXG4gICAgYWxsb3dlZFJvbGVzID0gXy5pbnRlcnNlY3Rpb24gdXNlclJvbGVzRmllbGQsIF8ua2V5cyBvYmpBbGxvd2VkUGF0aHNcblxuICAgIHVubGVzcyBhbGxvd2VkUm9sZXM/IGFuZCBhbGxvd2VkUm9sZXMubGVuZ3RoXG4gICAgICByZXR1cm4gbmV4dChuZXcgRXJyb3JIYW5kbGVyLlByaXZpbGFnZXNFcnJvciBcIllvdSBkb24ndCBoYXZlIHByaXZpbGFnZXNcIilcblxuICAgIGZvciBzdHJSb2xlLCBhcnJBbGxvd2VkUGF0aHMgb2Ygb2JqQWxsb3dlZFBhdGhzXG4gICAgICBpZiBzdHJSb2xlIGluIGFsbG93ZWRSb2xlc1xuICAgICAgICByZXEuYWxsb3dlZFBhcmFtcyA/PSB7fVxuICAgICAgICByZXEuYWxsb3dlZFBhcmFtcyA9IF8uYXNzaWduIHJlcS5hbGxvd2VkUGFyYW1zLCBfcGlja0FsbG93ZWRQYXRocyhhcnJBbGxvd2VkUGF0aHMsIHJlcSlcblxuICAgIG5leHQoKVxuXG5fcGlja0FsbG93ZWRQYXRocyA9IChhcnJBbGxvd2VkUGF0aHMsIHJlcU9iaikgLT5cbiAgdW5sZXNzIGFyckFsbG93ZWRQYXRocyBhbmQgYXJyQWxsb3dlZFBhdGhzLmxlbmd0aCBhbmQgXy5pc0FycmF5IGFyckFsbG93ZWRQYXRoc1xuICAgIHRocm93IG5ldyBFcnJvciAnQXJyYXkgb2YgYWxsb3dlZCBwYXRocyBpcyByZXF1aXJlZCdcblxuICBhcnJBbGxvd2VkUGF0aHNTcGxpdCA9IF8ubWFwIGFyckFsbG93ZWRQYXRocywgKGFsbG93ZWRQYXRoKSAtPiBhbGxvd2VkUGF0aC5zcGxpdCAnLidcbiAgYXJyQWxsb3dlZFBhdGhzVmFscyAgPSBfLm1hcCBhcnJBbGxvd2VkUGF0aHNTcGxpdCwgKGNvbXBvbmVudHMpIC0+IHRyYXZlcnNlKHJlcU9iai5ib2R5KS5nZXQoY29tcG9uZW50cykgPyB0cmF2ZXJzZShyZXFPYmouYm9keSkuZ2V0KGNvbXBvbmVudHMpXG5cbiAgYWxsb3dlZFBhcmFtcyA9IF8uemlwT2JqZWN0IGFyckFsbG93ZWRQYXRocywgYXJyQWxsb3dlZFBhdGhzVmFsc1xuICBhbGxvd2VkUGFyYW1zID0gXy5waWNrIGFsbG93ZWRQYXJhbXMsIChwYXJhbSkgLT4gdHlwZW9mIHBhcmFtIGlzbnQgXCJ1bmRlZmluZWRcIlxuXG4gIGFsbG93ZWRQYXJhbXNcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIEFsbG93ZWRQYXRoczogQWxsb3dlZFBhdGhzXG4gIEFsbG93ZWRQYXRoc1JvbGVzOiBBbGxvd2VkUGF0aHNSb2xlcyJdfQ==