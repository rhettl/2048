/**
 * Created by rhett on 5/20/14.
 */



angular.module('2048Game')
    .controller('fieldCtrl', ['$scope', 'FieldMatrix', 'hotkeys', function ($scope, FieldMatrix, hotkeys) {
        "use strict";

        $scope.winningNumber = 32;

        $scope.field = new FieldMatrix({winningNumber: $scope.winningNumber});

        $scope.add = function () {
            $scope.field.addRandomNumber();
        };
        $scope.reset = function(){
            if ($scope.field.win) {
                $scope.winningNumber += $scope.winningNumber;
            }
            $scope.field = new FieldMatrix({winningNumber: $scope.winningNumber});
        };

        var keyboard = [
            {
                combo: 'enter',
                callback: function (e) {
                    e.preventDefault();
                    if (!$scope.field.playable) {
                        $scope.reset();
                    }
                }
            },
            {
                combo: 'down',
                description: 'Slide Tiles Down',
                callback: function (e) {
                    e.preventDefault();
                    $scope.field.slide('down');
                }
            },
            {
                combo: 'up',
                description: 'Slide Tiles Up',
                callback: function (e) {
                    e.preventDefault();
                    $scope.field.slide('up');
                }
            },
            {
                combo: 'right',
                description: 'Slide Tiles Right',
                callback: function (e) {
                    e.preventDefault();
                    $scope.field.slide('right');
                }
            },
            {
                combo: 'left',
                description: 'Slide Tiles Left',
                callback: function (e) {
                    e.preventDefault();
                    $scope.field.slide('left');
                }
            }
        ];

        keyboard.forEach(function (item) {
            hotkeys.add(item)
        });

    }]);
