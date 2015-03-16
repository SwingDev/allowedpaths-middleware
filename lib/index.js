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
    return param != null;
  });
  return allowedParams;
};

module.exports = {
  AllowedPaths: AllowedPaths,
  AllowedPathsRoles: AllowedPathsRoles
};

//# sourceMappingURL=data:application/json;base64,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LGNBQVg7RUFBQSxDQUF0QixDQVBoQixDQUFBO1NBU0EsY0FWa0I7QUFBQSxDQTdDcEIsQ0FBQTs7QUFBQSxNQTBETSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsWUFBQSxFQUFjLFlBQWQ7QUFBQSxFQUNBLGlCQUFBLEVBQW1CLGlCQURuQjtDQTNERixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyBhbGxvd2VkcGF0aHMtbWlkZGxld2FyZVxuXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ2xvZGFzaCcpXG50cmF2ZXJzZSAgICAgID0gcmVxdWlyZSgndHJhdmVyc2UnKVxuRXJyb3JIYW5kbGVyICA9IHJlcXVpcmUubWFpbi5yZXF1aXJlKCdlcnJvci1oYW5kbGVyJylcblxuXG5BbGxvd2VkUGF0aHMgPSAoYXJyQWxsb3dlZFBhdGhzKSAtPlxuICAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgcmVxLmFsbG93ZWRQYXJhbXMgPSBfcGlja0FsbG93ZWRQYXRocyBhcnJBbGxvd2VkUGF0aHMsIHJlcVxuICAgIG5leHQoKVxuXG5BbGxvd2VkUGF0aHNSb2xlcyA9IChvYmpBbGxvd2VkUGF0aHMsIHt1c2VyRmllbGROYW1lLCB1c2VyUm9sZXNGaWVsZE5hbWV9ID0ge30pIC0+XG4gIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB1bmxlc3Mgb2JqQWxsb3dlZFBhdGhzIGFuZCAoXy5rZXlzIG9iakFsbG93ZWRQYXRocykubGVuZ3RoIGFuZCBfLmlzUGxhaW5PYmplY3Qgb2JqQWxsb3dlZFBhdGhzXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ0RpY3Qgb2YgYWxsb3dlZCBwYXRocyBmb3Igcm9sZXMgaXMgcmVxdWlyZWQnXG5cbiAgICB1c2VyRmllbGROYW1lICAgICAgPz0gJ3VzZXInXG4gICAgdXNlclJvbGVzRmllbGROYW1lID89ICdyb2xlcydcblxuICAgIHBhdGhUb1VzZXIgPSB1c2VyRmllbGROYW1lLnNwbGl0ICcuJ1xuICAgIHVubGVzcyB0cmF2ZXJzZShyZXEpLmhhcyhwYXRoVG9Vc2VyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVGhlcmUgaXMgbm8gI3t1c2VyRmllbGROYW1lfSBpbiByZXFcIlxuXG4gICAgb2JqVXNlciA9IHRyYXZlcnNlKHJlcSkuZ2V0KHBhdGhUb1VzZXIpXG5cbiAgICBwYXRoVG9Sb2xlcyA9IF8udW5pb24gWydfZG9jJ10sIHVzZXJSb2xlc0ZpZWxkTmFtZS5zcGxpdCAnLidcbiAgICBpZiB0cmF2ZXJzZShvYmpVc2VyKS5oYXMgcGF0aFRvUm9sZXNcbiAgICAgIHVzZXJSb2xlc0ZpZWxkID0gdHJhdmVyc2Uob2JqVXNlcikuZ2V0KHBhdGhUb1JvbGVzKVxuICAgIGVsc2UgaWYgXy5pc0Z1bmN0aW9uIG9ialVzZXJbdXNlclJvbGVzRmllbGROYW1lXVxuICAgICAgdXNlclJvbGVzRmllbGQgPSBvYmpVc2VyW3VzZXJSb2xlc0ZpZWxkTmFtZV0oKVxuXG4gICAgdW5sZXNzIF8uaXNBcnJheSB1c2VyUm9sZXNGaWVsZFxuICAgICAgdGhyb3cgbmV3IEVycm9yICdVc2VyIHJvbGVzIGZpZWxkIG11c3QgY29udGFpbiBhcnJheSBvZiByb2xlcydcblxuICAgIGFsbG93ZWRSb2xlcyA9IF8uaW50ZXJzZWN0aW9uIHVzZXJSb2xlc0ZpZWxkLCBfLmtleXMgb2JqQWxsb3dlZFBhdGhzXG5cbiAgICB1bmxlc3MgYWxsb3dlZFJvbGVzPyBhbmQgYWxsb3dlZFJvbGVzLmxlbmd0aFxuICAgICAgcmV0dXJuIG5leHQobmV3IEVycm9ySGFuZGxlci5Qcml2aWxhZ2VzRXJyb3IgXCJZb3UgZG9uJ3QgaGF2ZSBwcml2aWxhZ2VzXCIpXG5cbiAgICBmb3Igc3RyUm9sZSwgYXJyQWxsb3dlZFBhdGhzIG9mIG9iakFsbG93ZWRQYXRoc1xuICAgICAgaWYgc3RyUm9sZSBpbiBhbGxvd2VkUm9sZXNcbiAgICAgICAgcmVxLmFsbG93ZWRQYXJhbXMgPz0ge31cbiAgICAgICAgcmVxLmFsbG93ZWRQYXJhbXMgPSBfLmFzc2lnbiByZXEuYWxsb3dlZFBhcmFtcywgX3BpY2tBbGxvd2VkUGF0aHMoYXJyQWxsb3dlZFBhdGhzLCByZXEpXG5cbiAgICBuZXh0KClcblxuX3BpY2tBbGxvd2VkUGF0aHMgPSAoYXJyQWxsb3dlZFBhdGhzLCByZXFPYmopIC0+XG4gIHVubGVzcyBhcnJBbGxvd2VkUGF0aHMgYW5kIGFyckFsbG93ZWRQYXRocy5sZW5ndGggYW5kIF8uaXNBcnJheSBhcnJBbGxvd2VkUGF0aHNcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ0FycmF5IG9mIGFsbG93ZWQgcGF0aHMgaXMgcmVxdWlyZWQnXG5cbiAgYXJyQWxsb3dlZFBhdGhzU3BsaXQgPSBfLm1hcCBhcnJBbGxvd2VkUGF0aHMsIChhbGxvd2VkUGF0aCkgLT4gYWxsb3dlZFBhdGguc3BsaXQgJy4nXG4gIGFyckFsbG93ZWRQYXRoc1ZhbHMgID0gXy5tYXAgYXJyQWxsb3dlZFBhdGhzU3BsaXQsIChjb21wb25lbnRzKSAtPiB0cmF2ZXJzZShyZXFPYmouYm9keSkuZ2V0KGNvbXBvbmVudHMpID8gdHJhdmVyc2UocmVxT2JqLmJvZHkpLmdldChjb21wb25lbnRzKVxuXG4gIGFsbG93ZWRQYXJhbXMgPSBfLnppcE9iamVjdCBhcnJBbGxvd2VkUGF0aHMsIGFyckFsbG93ZWRQYXRoc1ZhbHNcbiAgYWxsb3dlZFBhcmFtcyA9IF8ucGljayBhbGxvd2VkUGFyYW1zLCAocGFyYW0pIC0+IHBhcmFtP1xuXG4gIGFsbG93ZWRQYXJhbXNcblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIEFsbG93ZWRQYXRoczogQWxsb3dlZFBhdGhzXG4gIEFsbG93ZWRQYXRoc1JvbGVzOiBBbGxvd2VkUGF0aHNSb2xlcyJdfQ==