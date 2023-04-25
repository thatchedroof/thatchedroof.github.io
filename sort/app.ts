const params = new URLSearchParams(window.location.search);

let items = document.getElementById('items')!;

let inp = <HTMLInputElement>document.getElementById('input');

inp.value = (params.get("items") ?? "").replaceAll(/(?<!\\),/g, '\n').replaceAll(/\\,/g, ',').replaceAll(/(?<!\\)_/g, ' ').replaceAll(/\\_/g, '_');
console.log(inp.value);
let input = inp.value.split('\n');

function buttonPress(): void {

    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("items", inp.value.replaceAll(/,/g, '\\,').replaceAll(/_/g, '\\_').replaceAll(/\n/g, ',').replaceAll(/ /g, '_'));
        window.history.pushState(null, '', '?' + searchParams.toString());
    }

    var el = document.getElementById('items');
    var sortable = Sortable.create(el);

    for (let item of input) {
        let li = document.createElement('li');
        li.innerHTML = item;
        li.classList.add('output-item');
        li.classList.add('item');
        items.appendChild(li);
    }
}

console.log(params);
