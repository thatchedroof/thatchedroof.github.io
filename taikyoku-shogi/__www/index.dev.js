"use strict";

if (document.addEventListener) {
  document.addEventListener('contextmenu', function (e) {
    //alert("You've tried to open context menu"); //here you draw your own menu
    e.preventDefault();
  }, false);
} else {
  document.attachEvent('oncontextmenu', function () {
    //alert("You've tried to open context menu");
    window.event.returnValue = false;
  });
}

var element = document.querySelector('#panzoom-container'); // And pass it to panzoom

var instance = panzoom(element, {
  maxZoom: 10,
  minZoom: 0.5,
  bounds: true,
  boundsPadding: 0.01
});
instance.on('pan', function (e) {
  // const shouldIgnore = !(e.button === 3);
  // return shouldIgnore;
  console.log(e);
}); // element.addEventListener('contextmenu', function (event) {
//     event.preventDefault(); // prevent the default context menu from showing up
//     panzoom(element).pan(event, true); // pan the zoomable area on right-click
// });