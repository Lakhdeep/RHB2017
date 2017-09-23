/**
 * Created by leon on 1/2/17.
 */
'use strict';

angular.module('engineStatusApp')
  .factory('ToDateObjectService', function () {
    var isoDatePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    return {
      convert: function (isoDate) {
        if(typeof isoDate === 'string' && isoDatePattern.test(isoDate)){
          return new Date(isoDate);
        }
        return isoDate;
      },
      convertAll: function (obj) {
        if(typeof obj === 'object'){
          for (var attr in obj){
            if (obj.hasOwnProperty(attr) && typeof obj[attr] === 'string') {
              obj[attr] = this.convert(obj[attr]);
            }
          }
        }
      }
    }
  })

  .factory('ArrayToDropdown', function () {
    return function (arr) {
        var result = [];
        for(var i=0; i< arr.length; i++){
          result.push({value: arr[i], text: arr[i]})
        }
        return result;
      }
  })

.filter('camelToSpace', function () {
  return function (input) {
    if(!input){
      return input;
    }
    return input
    // insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
    // uppercase the first character
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }
});
