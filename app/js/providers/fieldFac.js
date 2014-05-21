/**
 * Created by rhett on 5/20/14.
 */

angular.module('2048Game')
    .factory('FieldMatrix', [function () {
        "use strict";

        var defaultOptions = {
            rows: 4,
            cols: 4,
            tilesAtInit: 2,
            insertableNumbers: [2, 4],
            winningNumber: 2048
        };

        var FieldMatrix = function (options) {

            this.$options = angular.extend({}, defaultOptions, options);

            this.lose = false;
            this.win = false;

            this.playable = true;

            this.matrix = this.newMatrix(this.$options.rows, this.$options.cols);
            for (var i = 0; i < this.$options.tilesAtInit; i++) {
                this.addRandomNumber();
            }
        };

        //noinspection OverlyComplexFunctionJS
        var funcs = {
            newMatrix: function (x, y) {
                var matrix = [];
                for (var i = 0; i < x; i++) {
                    for (var j = 0; j < y; j++) {
                        if (!matrix[i]) {
                            matrix[i] = [];
                        }
                        matrix[i][j] = null;
                    }
                }
                return matrix;
            },
            getRandomAvailableTile: function () {
                "use strict";

                var openTiles = [];

                this.matrix.forEach(function (row, rowIndex) {
                    row.forEach(function (tile, tileIndex) {
                        if (tile === null) {
                            openTiles.push([rowIndex, tileIndex]);
                        }
                    })
                });
                return (openTiles.length ? this.randomArrayElem(openTiles) : false);

            },
            randomArrayElem: function (arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            },
            insertNumber: function (loc, number) {
                "use strict";
                return loc ? this.matrix[loc[0]][loc[1]] = number : false;
            },
            addRandomNumber: function () {
                return this.insertNumber(this.getRandomAvailableTile(), this.randomArrayElem(this.$options.insertableNumbers));
            },
            isSame: function (matrix1, matrix2) {
                if (matrix1.length !== matrix2.length) {
                    return false;
                }

                var out = true;
                matrix1.forEach(function (item, i) {

                    if (typeof matrix2[i] === undefined || matrix2[i].length !== item.length) {
                        out = false;
                        return false;
                    }

                    item.forEach(function (cell, j) {

                        if (typeof matrix2[i][j] === undefined || cell !== matrix2[i][j]) {
                            out = false;
                            return false;
                        }
                    });
                    if (!out) {
                        return false;
                    }
                });
                return out;
            },
            hasEmptyTiles: function () {
                for (var i = 0; i < this.matrix.length; i++) {
                    for (var j = 0; j < this.matrix[i].length; j++) {
                        if (this.matrix[i][j] === null) {
                            return true;
                        }
                    }
                }
                return false;
            },
            hasSameAdjacent: function () {
                for (var i = 0; i < this.matrix.length; i++) {
                    for (var j = 0; j < this.matrix[i].length; j++) {
                        if ((i + 1 < this.matrix.length && this.matrix[i + 1][j] === this.matrix[i][j])
                            || (i > 0 && this.matrix[i - 1][j] === this.matrix[i][j])
                            || (j + 1 < this.matrix.length && this.matrix[i][j + 1] === this.matrix[i][j])
                            || (j > 0 && this.matrix[i][j - 1] === this.matrix[i][j])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            canPlayOn: function () {
                return this.hasEmptyTiles() || this.hasSameAdjacent();
            },
            checkWin: function () {
                for (var i = 0; i < this.matrix.length; i++) {
                    for (var j = 0; j < this.matrix[i].length; j++) {
                        if (this.matrix[i][j] >= this.$options.winningNumber) {
                            this.win = true;
                            this.playable = false;
                            return true;
                        }
                    }
                }
                return false;
            },
            slide: function (dir) {
                "use strict";

                if (!this.playable) {
                    return;
                }

                var negative = dir === 'down' || dir === 'right',
                    col = dir === 'up' || dir === 'down',
                    primaryStart = col === true ? this.matrix[0].length - 1 : this.matrix.length - 1,
                    newMatrix = angular.copy(this.matrix);

                for (var i = primaryStart; i >= 0; i--) {
                    var numbers = [],
                        startNum = negative ? newMatrix.length - 1 : 0;
                    for (var j = startNum; (negative ? j >= 0 : j < newMatrix.length); (negative ? j-- : j++)) {
                        if (col) {
                            if (newMatrix[j][i] !== null) {
                                numbers.push(newMatrix[j][i]);
                                newMatrix[j][i] = null;
                            }
                        } else {
                            if (newMatrix[i][j] !== null) {
                                numbers.push(newMatrix[i][j]);
                                newMatrix[i][j] = null;
                            }
                        }
                    }
                    var j = startNum;
                    for (var k = 0; k < numbers.length; k++) {
                        var num;
                        if (k + 1 < numbers.length && numbers[k] === numbers[k + 1]) {
                            num = numbers[k] + numbers[k + 1];
                            k++;
                        } else {
                            num = numbers[k];
                        }
                        if (col) {
                            newMatrix[j][i] = num;
                        } else {
                            newMatrix[i][j] = num;
                        }
                        (negative ? j-- : j++);
                    }

                }

                var change = !this.isSame(newMatrix, this.matrix);

                this.matrix = newMatrix;

                if (!this.checkWin() && change) {
                    this.addRandomNumber();
                    if (!this.canPlayOn()) {
                        this.lose = true;
                        this.playable = false;
                    }
                }
            },
            slideDown: function () {
                "use strict";
                this.slide('down');
            },
            slideUp: function () {
                "use strict";
                this.slide('up');
            },
            slideLeft: function () {
                "use strict";
                this.slide('left');
            },
            slideRight: function () {
                "use strict";
                this.slide('right');
            }

        };

        angular.extend(FieldMatrix.prototype, funcs);

        return FieldMatrix;

    }]);