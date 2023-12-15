"use strict";
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
        return;
    }
    document.addEventListener('DOMContentLoaded', fn);
}
var main = function () {
    var squares = document.querySelector('.squares');
    var board = document.querySelector('#board');
    var panzoomContainer = document.querySelector('#panzoom-container');
    var squareData = [];
    var highlightData = [];
    var blackData = [];
    var greyData = [];
    var whiteData = [];
    for (var r = 0; r < 36; r++) {
        for (var c = 0; c < 36; c++) {
            squareData.push(board.contentDocument.documentElement.querySelector("#square-" + r + "-" + c));
            highlightData.push(board.contentDocument.documentElement.querySelector("#highlight-" + r + "-" + c));
            blackData.push(board.contentDocument.documentElement.querySelector("#black-" + r + "-" + c));
            greyData.push(board.contentDocument.documentElement.querySelector("#grey-" + r + "-" + c));
            whiteData.push(board.contentDocument.documentElement.querySelector("#white-" + r + "-" + c));
        }
    }
    for (var r = 0; r < 36; r++) {
        var _loop_1 = function (c) {
            var i = c * 36 + r;
            var square = document.createElement('div');
            square.classList.add('square-container');
            square.classList.add('square-container-' + i);
            // let image = document.createElement('img');
            // image.src = 'Black.svg';
            // image.style.visibility = 'hidden';
            // image.classList.add('square-image');
            // square.appendChild(image);
            // image = document.createElement('img');
            // image.src = 'Grey.svg';
            // image.style.visibility = 'hidden';
            // image.classList.add('square-image');
            // square.appendChild(image);
            // image = document.createElement('img');
            // image.src = 'White.svg';
            // image.style.visibility = 'visible';
            // image.classList.add('square-image');
            // square.appendChild(image);
            // image = document.createElement('img');
            // image.src = 'Highlight.svg';
            // image.style.visibility = 'hidden';
            // image.classList.add('square-image');
            // square.appendChild(image);
            // p1.style.visibility = 'visible';
            var piece = document.createElement('img');
            piece.src = 'ShogiUp.svg';
            // image.style.visibility = 'hidden';
            // piece.classList.add('square-image');
            // https://javascript.info/mouse-drag-and-drop
            piece.onmousedown = function (event) {
                // (1) prepare to moving: make absolute and on top by z-index
                piece.style.position = 'absolute';
                piece.style.zIndex = '1000';
                // move it out of any current parents directly into body
                // to make it positioned relative to the body
                // centers the piece at (pageX, pageY) coordinates
                function moveAt(pageX, pageY) {
                    piece.style.left = pageX - piece.offsetWidth / 2 + 'px';
                    piece.style.top = pageY - piece.offsetHeight / 2 + 'px';
                }
                // move our absolutely positioned piece under the pointer
                moveAt(event.pageX, event.pageY);
                var domRectContains = function (x, y, box) {
                    return box.x <= x && x <= box.x + box.width && box.y <= y && y <= box.y + box.height;
                };
                function onMouseMove(event) {
                    var x = event.pageX;
                    var y = event.pageY;
                    moveAt(x, y);
                    console.log(board);
                    for (var r_1 = 0; r_1 < 36; r_1++) {
                        for (var c_1 = 0; c_1 < 36; c_1++) {
                            if (domRectContains(x, y, squareData[c_1 * 36 + r_1].getBoundingClientRect())) {
                                highlightData[c_1 * 36 + r_1].setAttribute('visibility', 'visible');
                            }
                            else {
                                highlightData[c_1 * 36 + r_1].setAttribute('visibility', 'hidden');
                            }
                        }
                    }
                }
                // (2) move the piece on mousemove
                document.addEventListener('mousemove', onMouseMove);
                // (3) drop the piece, remove unneeded handlers
                piece.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove);
                    piece.onmouseup = null;
                };
            };
            piece.ondragstart = function () {
                return false;
            };
            square.appendChild(piece);
            squares === null || squares === void 0 ? void 0 : squares.appendChild(square);
        };
        for (var c = 0; c < 36; c++) {
            _loop_1(c);
        }
    }
    var children = squares.children;
    for (var i = 0; i < children.length; i++) {
        var square = children[i];
    }
};
window.onload = function () {
    ready(main);
};
