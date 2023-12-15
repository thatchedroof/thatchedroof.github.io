function ready(fn: any) {
    if (document.readyState !== 'loading') {
        fn();
        return;
    }
    document.addEventListener('DOMContentLoaded', fn);
}

const main = () => {
    let squares = document.querySelector('.squares');

    let board = document.querySelector('#board') as HTMLObjectElement;

    let panzoomContainer = document.querySelector('#panzoom-container') as HTMLObjectElement;

    let squareData: Element[] = [];
    let highlightData: Element[] = [];
    let blackData: Element[] = [];
    let greyData: Element[] = [];
    let whiteData: Element[] = [];


    for (let r = 0; r < 36; r++) {
        for (let c = 0; c < 36; c++) {
            squareData.push(board.contentDocument!.documentElement.querySelector(`#square-${r}-${c}`)!);
            highlightData.push(board.contentDocument!.documentElement.querySelector(`#highlight-${r}-${c}`)!);
            blackData.push(board.contentDocument!.documentElement.querySelector(`#black-${r}-${c}`)!);
            greyData.push(board.contentDocument!.documentElement.querySelector(`#grey-${r}-${c}`)!);
            whiteData.push(board.contentDocument!.documentElement.querySelector(`#white-${r}-${c}`)!);
        }
    }

    for (let r = 0; r < 36; r++) {
        for (let c = 0; c < 36; c++) {
            let i = c * 36 + r;
            let square = document.createElement('div');
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



            let piece = document.createElement('img');
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
                function moveAt(pageX: number, pageY: number) {
                    piece.style.left = pageX - piece.offsetWidth / 2 + 'px';
                    piece.style.top = pageY - piece.offsetHeight / 2 + 'px';
                }

                // move our absolutely positioned piece under the pointer
                moveAt(event.pageX, event.pageY);

                const domRectContains = (
                    x: number,
                    y: number,
                    box: { x: number; y: number; width: number; height: number; }
                ) => {
                    return box.x <= x && x <= box.x + box.width && box.y <= y && y <= box.y + box.height;
                };

                function onMouseMove(event: MouseEvent) {
                    let x = event.pageX;
                    let y = event.pageY;
                    moveAt(x, y);
                    console.log(board);
                    for (let r = 0; r < 36; r++) {
                        for (let c = 0; c < 36; c++) {
                            if (domRectContains(x, y, squareData[c * 36 + r].getBoundingClientRect())) {
                                highlightData[c * 36 + r]!.setAttribute('visibility', 'visible');
                            } else {
                                highlightData[c * 36 + r]!.setAttribute('visibility', 'hidden');
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

            squares?.appendChild(square);
        }
    }
    let children = squares!.children;
    for (let i = 0; i < children.length; i++) {
        let square = children[i];

    }
};
window.onload = () => {
    ready(main);
};
