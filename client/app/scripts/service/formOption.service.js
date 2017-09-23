/**
 * Created by leon on 12/2/17.
 */
'use strict';

angular.module('engineStatusApp')
  .service('formOptionService', function($http) {
    return {
      getCustomerStaffList: function () {
        return $http({
          method: 'GET',
          url: '/customer-staff',
          params:{}
        })
      },

      getCustomerRepList: function () {
        return $http({
          method: 'GET',
          url: '/console-user',
          params:{}
        })
      },

      getEngineList: function () {
        return $http({
          method: 'GET',
          url: '/engine',
          params:{}
        })
      },

      getCompanyList: function () {
        return $http({
          method: 'GET',
          url: '/customer-company',
          params:{}
        })
      },

      getDropDownLists: function (id) {
        return $http({
          method: 'GET',
          url: '/assignment',
          params:{}
        })
      }
    }

  });

