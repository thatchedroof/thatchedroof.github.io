//import * as d3 from '../node_modules/d3/src/index.js';
import * as stocks from './stocks.js';
//import * as Plotly from 'plotly.js';
console.log('alive!');

let bottom = document.getElementById('bottom-section')!;

const chosenCompanies = stocks.chooseCompanies(10);

console.log(chosenCompanies.map((c) => c[1]));

let currentStocks: stocks.StockHistory = [[chosenCompanies, 1, stocks.mu, stocks.sigma]];

let money = 1000;

const nextRound = document.getElementById('next-round')!;

currentStocks = stocks.simulateStocks(currentStocks, 91 * 2);

const update = () => {

    for (let i = 91; i < 182; i++) {
        setTimeout(() => {
            let charts = chosenCompanies.map((c, j) => {
                return CandlestickChart(dataize(currentStocks.slice(-182).slice(0, i), 4, j, 182), {
                    date: d => d.date,
                    high: d => d.high,
                    low: d => d.low,
                    open: d => d.open,
                    close: d => d.close,
                    //xRange: [0, 182],
                    yLabel: "↑ Price ($)",
                    width: (bottom.firstElementChild!.firstElementChild! as HTMLElement).offsetWidth,
                    height: (bottom.firstElementChild!.firstElementChild! as HTMLElement).offsetHeight,
                })!;
            });

            bottom.firstElementChild!.innerHTML = '';

            for (let chart of charts) {
                bottom.firstElementChild!.appendChild(chart);
            }

            bottom.firstElementChild!.appendChild(CandlestickChart(portfolioDataize(currentStocks.slice(-182), 4), {
                date: d => d.date,
                high: d => d.high,
                low: d => d.low,
                open: d => d.open,
                close: d => d.close,
                yLabel: "↑ Price ($)",
                width: 1600,
                height: 800,
            })!);

        }, i / 2);
    }
    setTimeout(() => {

        let lastStock = currentStocks[currentStocks.length - 1];
        bottom.innerHTML = `<div class="cards">`.concat(...
            lastStock[0].map((c, j) => {
                return `<div class="card">
                    <div class="title"><span class="tooltip">${c[1]}<span class="tooltiptext">${c[0]}<br>${c[2]}</span></span> <span class="diff">$${currentStocks[currentStocks.length - 91][0][j][4].toFixed(2)}->$${c[4].toFixed(2)}</span></div>
                    <div class="price">
                    <button id="100decrease${j}" class="button">&lt;</button>
                    <button id="10decrease${j}" class="button">&lt;</button>
                    <button id="decrease${j}" class="button">&lt;</button>
                    <span id="stocks${j}">${c[6]}</span>
                    <button id="increase${j}" class="button">&gt;</button>
                    <button id="10increase${j}" class="button">&gt;</button>
                    <button id="100increase${j}" class="button">&gt;</button>
                    </div>
                </div>`;
            }
            )).concat(
                `</div>`);

        for (let j = 0; j < chosenCompanies.length; j++) {
            document.getElementById(`100decrease${j}`)!.addEventListener('click', () => { changeStock(j, -100); }, false);
            document.getElementById(`10decrease${j}`)!.addEventListener('click', () => { changeStock(j, -10); }, false);
            document.getElementById(`decrease${j}`)!.addEventListener('click', () => { changeStock(j, -1); }, false);
            document.getElementById(`increase${j}`)!.addEventListener('click', () => { changeStock(j, 1); }, false);
            document.getElementById(`10increase${j}`)!.addEventListener('click', () => { changeStock(j, 10); }, false);
            document.getElementById(`100increase${j}`)!.addEventListener('click', () => { changeStock(j, 100); }, false);
        }
        currentStocks = stocks.simulateStocks(currentStocks, 91);

    }, 10000);

};

update();

nextRound.addEventListener('click', update, false);

const changeStock = (i: number, inputChange: number) => {
    let newMoney = money - inputChange * currentStocks[currentStocks.length - 1][0][i][4];
    let ele = document.getElementById(`stocks${i}`)!;
    let change = inputChange;
    if (parseInt(ele.innerHTML) + change < 0) {
        change = -parseInt(ele.innerHTML);
    } else {
        while (newMoney < 0) {
            change = change - 1;
            newMoney = money - change * currentStocks[currentStocks.length - 1][0][i][4];
        }
    }
    newMoney = money - change * currentStocks[currentStocks.length - 1][0][i][4];
    money = newMoney;
    currentStocks = stocks.changeStockOwnership(
        currentStocks, i, change,
    );
    console.log(i, change);
    let moneyCounter = document.getElementById('money-counter')!;
    ele.innerHTML = (parseInt(ele.innerHTML) + change).toString();
    console.log(money);
    moneyCounter.innerHTML = `$${money.toFixed(2)}`;
};




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

// console.log(JSON.stringify(aapl));

// d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv', function (err, rows) {


//     function unpack(rows, key) {

//         return rows.map(function (row) {

//             return row[key];

//         });

//     }


//     var trace = {

//         x: unpack(rows, 'Date'),

//         close: unpack(rows, 'AAPL.Close'),

//         high: unpack(rows, 'AAPL.High'),

//         low: unpack(rows, 'AAPL.Low'),

//         open: unpack(rows, 'AAPL.Open'),


//         // cutomise colors

//         increasing: { line: { color: 'black' } },

//         decreasing: { line: { color: 'red' } },


//         type: 'candlestick',

//         xaxis: 'x',

//         yaxis: 'y'

//     };


//     var data = [trace];


//     var layout = {

//         dragmode: 'zoom',

//         showlegend: false,

//         xaxis: {

//             rangeslider: {

//                 visible: false

//             }

//         }

//     };


//     Plotly.newPlot('myDiv', data, layout);

// });

function dataize(history: stocks.StockHistory, chunkSize: number, company: number, fill: number | undefined = undefined): Data[] {
    let chunks = history.reduce((resultArray: stocks.StockHistory[], item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []).map((chunk, i, cs) => {
        if (i !== 0) {
            return [cs[i - 1][cs[i - 1].length - 1]].concat(chunk);
        } else {
            return chunk;
        }
    });
    if (fill == null) {
        fill = chunks.length;
    }
    console.log('funny', new Array(fill - chunks.length).fill(chunks[chunks.length - 1]));
    return chunks.map((chunk, i) => {
        console.log(chunk.map(c => c[0][company][4]));
        let d = new Date();
        d.setDate(new Date().getDate() + i);
        return {
            date: d.toISOString().split('T')[0],
            high: Math.max(...chunk.map(c => c[0][company][4])),
            open: chunk[0][0][company][4],
            close: chunk[chunk.length - 1][0][company][4],
            low: Math.min(...chunk.map(c => c[0][company][4])),
        } as Data;
    }).concat(new Array(fill - chunks.length).fill(chunks[chunks.length - 1]));
};

function portfolioDataize(history: stocks.StockHistory, chunkSize: number): Data[] {
    let chunks = history.reduce((resultArray: stocks.StockHistory[], item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []).map((chunk, i, cs) => {
        if (i !== 0) {
            return [cs[i - 1][cs[i - 1].length - 1]].concat(chunk);
        } else {
            return chunk;
        }
    });
    return chunks.map((chunk, i) => {
        console.log(chunk.map(c => c[0].reduce((p, a) => p + a[4] * a[6], 0) + money));
        let d = new Date();
        d.setDate(new Date().getDate() + i);
        return {
            date: d.toISOString().split('T')[0],
            high: Math.max(...chunk.map(c => c[0].reduce((p, a) => p + a[4] * a[6], 0) + money)),
            open: chunk[0][0].reduce((p, a) => p + a[4] * a[6], 0) + money,
            close: chunk[chunk.length - 1][0].reduce((p, a) => p + a[4] * a[6], 0) + money,
            low: Math.min(...chunk.map(c => c[0].reduce((p, a) => p + a[4] * a[6], 0) + money)),
        } as Data;
    });
};

type Data = {
    date: string,
    open: number,
    close: number,
    high: number,
    low: number;
};

/**
 * From https://observablehq.com/@d3/candlestick-chart
 */
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
    strokeLinecap = "butt", // stroke line cap for the rules
    colors = ["#4daf4a", "#999999", "#e41a1c"] // [up, no change, down]
} = {}) {
    // Compute values.
    const X = d3.map(data, date);
    const Yo = d3.map(data, open);
    const Yc = d3.map(data, close);
    const Yh = d3.map(data, high);
    const Yl = d3.map(data, low);
    const I = d3.range(X.length);

    console.log(X);

    const weeks = (start: string, stop: string, stride: number) => d3.utcMonday.every(stride)!.range(new Date(start), +new Date(new Date(stop).getDate() + 1)).map(n => n.toISOString().split('T')[0]);
    const weekdays = (start: string, stop: string) => d3.utcDays(start, +stop + 1).filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

    console.log(xDomain, yDomain, xTicks, xRange, yRange);
    // Compute default domains and ticks.
    if (xDomain == null) xDomain = X;
    if (yDomain == null) yDomain = [d3.min(Yl)!, d3.max(Yh)!];
    if (xTicks == null) xTicks = [];//X;
    if (xRange == null) xRange = [marginLeft, width - marginRight];
    if (yRange == null) yRange = [height - marginBottom, marginTop];
    console.log(xDomain, yDomain, xTicks, xRange, yRange);

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
        title = (i: number) => `${X[i]}
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
            //.text(yLabel!)
        );

    const g = svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
        .attr("transform", i => `translate(${xScale(X[i])},0)`);

    g.append("line")
        .attr("y1", i => yScale(Yl[i]))
        .attr("y2", i => yScale(Yh[i]))
        .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

    g.append("line")
        .attr("y1", i => yScale(Yo[i]))
        .attr("y2", i => yScale(Yc[i]))
        .attr("stroke-width", xScale.bandwidth())
        .attr("stroke", i => colors[1 + Math.sign(Yo[i] - Yc[i])]);

    if (title) g.append("title")
        .text(title);

    return svg.node();
}

