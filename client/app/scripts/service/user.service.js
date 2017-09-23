'use strict';

angular.module('engineStatusApp')
  .factory('User', function ($resource) {
    return $resource('/api/user/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  })
  //Not sure how to use resource, so I made a new service which is easier to use
  .service('UserService', function ($http) {
    return {
      getMe: function () {
        return $http({
          method: 'GET',
          url: '/api/user/me',
          params:{}
        })
      },
      get : function (id) {
        return $http({
          method: 'GET',
          url: '/api/user/' + id,
          params:{}
        })
      },
    }
  })
;
