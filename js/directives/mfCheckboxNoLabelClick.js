'use strict';

mindFrameApp.directive('mfCheckboxNoLabelClick', [
  function () {
    return {
      restrict: 'EA',
      scope: {
        cnt: '=',
        person: '=',
        isChecked: '@',
        selectedContent: '='
      },
      templateUrl: 'templates/mf-checkbox-no-label-click.html',
      replace: true,
      link: function ($scope, element, attrs, ctrl) {
        element.bind('click', function (evt) {
          addRemoveContent($scope.cnt);
        });

        function addRemoveContent (cnt) {
          if(!$scope.person.content) $scope.person.content = [];
          var toRemove = false;
          var cntIdx = null;
          if($scope.person && $scope.person.content){
              var i=0, len=$scope.person.content.length;
              for (; i<len; i++) {
                if ($scope.person.content[i].id == cnt.id) {
                  toRemove = true;
                  cntIdx = i;
                  break;
                }
              }
          }
          if (toRemove) {
            $scope.person.content.splice(cntIdx, 1);
            return false;
          } else {
            $scope.person.content.push(cnt);
            return true;
            $scope.selectedContent = cnt;
          }
        };
      }
    };
  }
]);
