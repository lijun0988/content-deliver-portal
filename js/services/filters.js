'use strict';

/* Filters */
mindFrameApp.filter('convertToId', function() {
  return function(input) {
	return input.replace(/[_\W]+/g,'').replace(/ /g,'-').toLowerCase();
  };
});



