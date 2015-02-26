var AllowedPaths, _, traverse;

_ = require('lodash');

traverse = require('traverse');

module.exports = AllowedPaths = function(arrAllowedPaths) {
  return function(req, res, next) {
    var allowedParams, arrAllowedPathsSplit, arrAllowedPathsVals;
    if (!(arrAllowedPaths || arrAllowedPaths.length || _.isArray(arrAllowedPaths))) {
      throw new Error('Array of allowed paths is required');
    }
    arrAllowedPathsSplit = _.map(arrAllowedPaths, function(allowedPath) {
      return allowedPath.split('.');
    });
    arrAllowedPathsVals = _.map(arrAllowedPathsSplit, function(components) {
      var ref;
      return (ref = traverse(req.body).get(components)) != null ? ref : traverse(req.body).get(components);
    });
    allowedParams = _.zipObject(arrAllowedPaths, arrAllowedPathsVals);
    allowedParams = _.pick(allowedParams, function(param) {
      return param != null;
    });
    req.allowedParams = allowedParams;
    return next();
  };
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFBLHlCQUFBOztBQUFBLENBQUEsR0FBVyxPQUFBLENBQVEsUUFBUixDQUFYLENBQUE7O0FBQUEsUUFDQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTs7QUFBQSxNQUlNLENBQUMsT0FBUCxHQUFpQixZQUFBLEdBQWUsU0FBQyxlQUFELEdBQUE7U0FDOUIsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLElBQVgsR0FBQTtBQUNFLFFBQUEsd0RBQUE7QUFBQSxJQUFBLElBQUEsQ0FBQSxDQUFPLGVBQUEsSUFBbUIsZUFBZSxDQUFDLE1BQW5DLElBQTZDLENBQUMsQ0FBQyxPQUFGLENBQVUsZUFBVixDQUFwRCxDQUFBO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSxvQ0FBTixDQUFWLENBREY7S0FBQTtBQUFBLElBR0Esb0JBQUEsR0FBdUIsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxlQUFOLEVBQXVCLFNBQUMsV0FBRCxHQUFBO2FBQWlCLFdBQVcsQ0FBQyxLQUFaLENBQWtCLEdBQWxCLEVBQWpCO0lBQUEsQ0FBdkIsQ0FIdkIsQ0FBQTtBQUFBLElBSUEsbUJBQUEsR0FBdUIsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxvQkFBTixFQUE0QixTQUFDLFVBQUQsR0FBQTtBQUFnQixVQUFBLEdBQUE7d0VBQXFDLFFBQUEsQ0FBUyxHQUFHLENBQUMsSUFBYixDQUFrQixDQUFDLEdBQW5CLENBQXVCLFVBQXZCLEVBQXJEO0lBQUEsQ0FBNUIsQ0FKdkIsQ0FBQTtBQUFBLElBTUEsYUFBQSxHQUFnQixDQUFDLENBQUMsU0FBRixDQUFZLGVBQVosRUFBNkIsbUJBQTdCLENBTmhCLENBQUE7QUFBQSxJQU9BLGFBQUEsR0FBZ0IsQ0FBQyxDQUFDLElBQUYsQ0FBTyxhQUFQLEVBQXNCLFNBQUMsS0FBRCxHQUFBO2FBQVcsY0FBWDtJQUFBLENBQXRCLENBUGhCLENBQUE7QUFBQSxJQVNBLEdBQUcsQ0FBQyxhQUFKLEdBQW9CLGFBVHBCLENBQUE7V0FXQSxJQUFBLENBQUEsRUFaRjtFQUFBLEVBRDhCO0FBQUEsQ0FKaEMsQ0FBQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMgYWxsb3dlZHBhdGhzLW1pZGRsZXdhcmVcblxuXyAgICAgICAgPSByZXF1aXJlKCdsb2Rhc2gnKVxudHJhdmVyc2UgPSByZXF1aXJlKCd0cmF2ZXJzZScpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBBbGxvd2VkUGF0aHMgPSAoYXJyQWxsb3dlZFBhdGhzKSAtPlxuICAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdW5sZXNzIGFyckFsbG93ZWRQYXRocyBvciBhcnJBbGxvd2VkUGF0aHMubGVuZ3RoIG9yIF8uaXNBcnJheSBhcnJBbGxvd2VkUGF0aHNcbiAgICAgIHRocm93IG5ldyBFcnJvciAnQXJyYXkgb2YgYWxsb3dlZCBwYXRocyBpcyByZXF1aXJlZCdcblxuICAgIGFyckFsbG93ZWRQYXRoc1NwbGl0ID0gXy5tYXAgYXJyQWxsb3dlZFBhdGhzLCAoYWxsb3dlZFBhdGgpIC0+IGFsbG93ZWRQYXRoLnNwbGl0ICcuJ1xuICAgIGFyckFsbG93ZWRQYXRoc1ZhbHMgID0gXy5tYXAgYXJyQWxsb3dlZFBhdGhzU3BsaXQsIChjb21wb25lbnRzKSAtPiB0cmF2ZXJzZShyZXEuYm9keSkuZ2V0KGNvbXBvbmVudHMpID8gdHJhdmVyc2UocmVxLmJvZHkpLmdldChjb21wb25lbnRzKVxuXG4gICAgYWxsb3dlZFBhcmFtcyA9IF8uemlwT2JqZWN0IGFyckFsbG93ZWRQYXRocywgYXJyQWxsb3dlZFBhdGhzVmFsc1xuICAgIGFsbG93ZWRQYXJhbXMgPSBfLnBpY2sgYWxsb3dlZFBhcmFtcywgKHBhcmFtKSAtPiBwYXJhbT9cblxuICAgIHJlcS5hbGxvd2VkUGFyYW1zID0gYWxsb3dlZFBhcmFtc1xuXG4gICAgbmV4dCgpXG4iXX0=