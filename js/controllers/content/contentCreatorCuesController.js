'use strict';

mindFrameControllers.controller('cuePropertiesController', [
    '$scope',
    'ngMessages',
    '$modalInstance',
    'selectedCue',
    'selectedContent',
    function ($scope, ngMessages, $modalInstance, selectedCue, selectedContent) {
        $scope.selectedCue = selectedCue;
        $scope.selectedContent = selectedContent;

        $scope.text = selectedCue.text;
        $scope.description = selectedCue.description;
        $scope.showCueTextError = false;

        $scope.saveCueProperties = function () {
            if ($scope.validate()) {
                if ($scope.selectedCue.isNew) {
                    $scope.selectedCue["order"] = $scope.selectedContent.length;
                    $scope.selectedCue["isNew"] = false;
                    $scope.selectedContent.push($scope.selectedCue);
                }
                $modalInstance.close($scope.selectedCue);
                $scope.save();
            }
        }

        $scope.saveAndAdd = function () {
            if ($scope.validate()) {
                if ($scope.selectedCue.isNew) {
                    $scope.selectedCue["order"] = $scope.selectedContent.length;
                    $scope.selectedCue["isNew"] = false;
                    $scope.selectedContent.push($scope.selectedCue);
                }
                $scope.selectedCue = $scope.saveAndAddCue($scope.selectedContent);
                $scope.showCueTextError = false;
            }
        };

        $scope.validate = function () {
            if ($scope.selectedCue.text && $scope.selectedCue.text.trim().length > 0) {
                return true;
            }
            $scope.showCueTextError = true;
            return false;
        };

        $scope.cancel = function () {
            $scope.selectedCue.text = $scope.text;
            $scope.selectedCue.description = $scope.description;
            $modalInstance.dismiss('cancel');
        };
        $('input[autofocus]:visible:first').focus();
    }
]);