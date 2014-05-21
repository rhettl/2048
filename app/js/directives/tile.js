/**
 * Created by rhett on 5/20/14.
 */

angular.module('2048Game')
    .directive('tile', ['$parse', function ($parse) {
        "use strict";

        var multiplyColors = function (rgb1, rgb2) {
            var result = [];
            for (var i = 0; i < rgb1.length; i++) {
                result.push(Math.floor(rgb1[i] * rgb2[i] / 255));
            }
            return result;
        };
        var hexToDecColor = function (color) {
                var chars = color.match(/[0-9a-fA-F]/);
                if (chars.length === 3) {
                    chars = [chars[0], chars[0], chars[1], chars[1], chars[2], chars[2]];
                }

                if (chars.length === 6) {
                    return [chars[0] + chars[1], chars[2] + chars[3], chars[4] + chars[5]].map(function (item) {
                        return parseInt(item, 16);
                    });
                }

                return [255, 255, 255];

            },
            decToHexColor = function (color) {
                return '#' + color.map(function(item){
                    return item.toString(16);
                }).join('');
            };

        return {
            restrict: 'A',
            replace: true,
            link: function (scope, elem, attrs) {
                var getTileNum = $parse(attrs.tile),
                    currentTileNumber = getTileNum(scope),
                    getWinningNumber = $parse(attrs.winningNumber),
                    winningNumber = getWinningNumber(scope) || 2048,
                    baseColor = hexToDecColor(scope.$eval(attrs.baseColor) || '#ed9c28'),
                    changeTileColor = function (number) {
                        var currentPercent = Math.abs((number / winningNumber) - 1) * 255;
                        elem.css({
                            'background-color': decToHexColor(multiplyColors(baseColor, [currentPercent, currentPercent, currentPercent]))
                        });
                    };

                scope.$watch(function () {
                    var newTileNumber = getTileNum(scope);
                    if (newTileNumber !== currentTileNumber) {
                        winningNumber = getWinningNumber(scope) || 2048;
                        currentTileNumber = newTileNumber;
                        changeTileColor(newTileNumber);
                    }
                });
                changeTileColor(currentTileNumber);
            }
        };
    }]);