"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var stocks = _interopRequireWildcard(require("./stocks.js"));

var _ref;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

//import * as Plotly from 'plotly.js';
console.log('alive!');
var bottom = document.getElementById('bottom-section');
var chosenCompanies = stocks.chooseCompanies(10);
console.log(chosenCompanies.map(function (c) {
  return c[1];
}));
bottom.innerHTML = (_ref = "<div id=\"cards\">").concat.apply(_ref, _toConsumableArray(chosenCompanies.map(function (c) {
  return "<div class=\"card\">\n        <div class=\"title\">".concat(c[1], "</div>\n        <div class=\"price\">$").concat(c[4].toFixed(2), "</div>\n    </div>");
}))).concat("</div>");
/*
const randomData = (d: Data): Data => {
    return {
        date: new Date(new Date(d.date).getDate() + 1).toString(),
        open: d.open + Math.random() - .5,
        close: d.close + Math.random() - .5,
        high: d.high + Math.random() - .5,
        low: d.low + Math.random() - .5,
    };
};

const randomDataList = (n: number, init: Data): Data[] => {
    let out: Data[] = [init];

    for (let i = 0; i < n; i++) {
        out.push(randomData(out[out.length - 1]));
    }

    return out;
};

let aapl: Data[] = randomDataList(1, { date: '2017-11-17', open: 171.039993, high: 171.389999, low: 169.639999, close: 170.149994 });

console.log(JSON.stringify(aapl));

d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv', function (err, rows) {


    function unpack(rows, key) {

        return rows.map(function (row) {

            return row[key];

        });

    }


    var trace = {

        x: unpack(rows, 'Date'),

        close: unpack(rows, 'AAPL.Close'),

        high: unpack(rows, 'AAPL.High'),

        low: unpack(rows, 'AAPL.Low'),

        open: unpack(rows, 'AAPL.Open'),


        // cutomise colors

        increasing: { line: { color: 'black' } },

        decreasing: { line: { color: 'red' } },


        type: 'candlestick',

        xaxis: 'x',

        yaxis: 'y'

    };


    var data = [trace];


    var layout = {

        dragmode: 'zoom',

        showlegend: false,

        xaxis: {

            rangeslider: {

                visible: false

            }

        }

    };


    Plotly.newPlot('myDiv', data, layout);

});

// /**
//  * From https://observablehq.com/@d3/candlestick-chart
//
let chart = CandlestickChart(aapl, {
    date: d => d.date,
    high: d => d.high,
    low: d => d.low,
    open: d => d.open,
    close: d => d.close,
    yLabel: "↑ Price ($)",
    width: 640,
    height: 500
})!;

type Data = {
    date: string,
    open: number,
    close: number,
    high: number,
    low: number;
};

// /**
//  * From https://observablehq.com/@d3/candlestick-chart
//
function CandlestickChart(data: Data[], {
    date = (d: Data) => d.date, // given d in data, returns the (temporal) x-value
    open = (d: Data) => d.open, // given d in data, returns a (quantitative) y-value
    close = (d: Data) => d.close, // given d in data, returns a (quantitative) y-value
    high = (d: Data) => d.high, // given d in data, returns a (quantitative) y-value
    low = (d: Data) => d.low, // given d in data, returns a (quantitative) y-value
    title = undefined as ((i: number) => string) | undefined, // given d in data, returns the title text
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain = undefined as string[] | undefined, // array of x-values (defaults to every weekday)
    xRange = undefined as [number, number] | undefined, // [left, right]
    xPadding = 0.2,
    xTicks = undefined as string[] | undefined, // array of x-values to label (defaults to every other Monday)
    yType = d3.scaleLinear, // type of y-scale
    yDomain = undefined as number[] | undefined, // [ymin, ymax]
    yRange = undefined as [number, number] | undefined, // [bottom, top]
    xFormat = "%b %-d", // a format specifier for the date on the x-axis
    yFormat = "~f", // a format specifier for the value on the y-axis
    yLabel = undefined as string | undefined, // a label for the y-axis
    stroke = "currentColor", // stroke color for the daily rule
    strokeLinecap = "round", // stroke line cap for the rules
    colors = ["#4daf4a", "#999999", "#e41a1c"] // [up, no change, down]
} = {}) {
    // Compute values.
    const X = d3.map(data, date);
    const Yo = d3.map(data, open);
    const Yc = d3.map(data, close);
    const Yh = d3.map(data, high);
    const Yl = d3.map(data, low);
    const I = d3.range(X.length);

    const weeks = (start: string, stop: string, stride: number) => d3.utcMonday.every(stride)!.range(new Date(start), new Date(new Date(stop).getDate() + 1)).map(n => n.toString());
    const weekdays = (start: string, stop: string) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

    // Compute default domains and ticks.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [d3.min(Yl)!, d3.max(Yh)!];
    if (xTicks === undefined) xTicks = weeks(d3.min(xDomain)!, d3.max(xDomain)!, 2);
    if (xRange === undefined) xRange = [marginLeft, width - marginRight];
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Construct scales and axes.
    // If you were to plot a stock using d3.scaleUtc, you’d see distracting gaps
    // every weekend. This chart therefore uses a d3.scaleBand whose domain is every
    // weekday in the dataset. A few gaps remain for holiday weekdays, such as
    // Christmas, but these are infrequent and allow the labeling of Mondays. As a
    // band scale, we specify explicit tick values.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain!, yRange);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat)).tickValues(xTicks);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Compute titles.
    if (title === undefined) {
        const formatstring = d3.utcFormat("%B %-d, %Y");
        const formatValue = d3.format(".2f");
        const formatChange = (f => (y0: number, y1: number) => f((y1 - y0) / y0))(d3.format("+.2%"));
        title = (i: number) => `${formatstring(X[i])}
  Open: ${formatValue(Yo[i])}
  Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
  Low: ${formatValue(Yl[i])}
  High: ${formatValue(Yh[i])}`;
    } else if (title !== null) {
        const T = d3.map(data, title);
        title = (i: number) => T[i];
    }

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel!));

    const g = svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
        .attr("transform", i => `translate(${xScale(X[i])},0)`);

    g.append("line")
        .attr("y1", i => yScale(Yl[i]))
        .attr("y2", i => yScale(Yh[i]));

    g.append("line")
        .attr("y1", i => yScale(Yo[i]))
        .attr("y2", i => yScale(Yc[i]))
        .attr("stroke-width", xScale.bandwidth())
        .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

    if (title) g.append("title")
        .text(title);

    return svg.node();
}
// cardElements.appendChild(

// );
*/