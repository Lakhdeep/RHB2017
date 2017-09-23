(function () {
  'use strict';

  angular.module('engineStatusApp')
    .directive('csSelect', function () {
      return {
        require: '^stTable',
        template: '<input type="checkbox" ng-checked="row.isSelected || false"/>',
        //transclude: true,
        scope: {
          row: '=csSelect',
          checkbox:'=',
        },
        link: function (scope, element, attr, ctrl) {

          element.bind('change', function (evt) {
            scope.$apply(function () {
              ctrl.select(scope.row, 'multiple');
            });
          });
          scope.$watch('row.isSelected', function (newValue = false, oldValue) {

            if (scope.checkbox != undefined) {
              if (newValue === true) {
                scope.checkbox.selected++;
              }
              else if (newValue === false && scope.checkbox.selected > 0) {
                scope.checkbox.selected--;
              }
            }
          });



        }
      };
    })
})();
