function buttonPress(): void {
    let output = document.getElementById('output')!;

    output.textContent = '';

    let inp = <HTMLInputElement>document.getElementById('input');

    let input = inp.value;

    let splitInp = <string[]>input.match(/(.|[\r\n]){1,2000}/g);

    console.log(splitInp);

    for (let i = 0; i < splitInp.length; i++) {
        let outputItem = document.createElement('div');

        outputItem.classList.add('output-item');

        //

        let outputText = document.createElement('textarea');

        //outputText.setAttribute('readonly', 'readonly');

        outputText.setAttribute('rows', '10');

        outputText.setAttribute('id', `output-text-${i}`);

        outputText.value = splitInp[i];

        outputText.classList.add('output-text');

        //

        let outputClip = document.createElement('button');

        outputClip.setAttribute('onclick', `selectOutput(${i})`);

        outputClip.classList.add('copy-button');

        outputClip.innerText = 'Copy';

        let hue: number = 0;

        if (splitInp.length === 2) {
            if (i === 0) {
                hue = 0;
            } else {
                hue = 240;
            }
        } else if (splitInp.length === 3) {
            if (i === 0) {
                hue = 0;
            } else if (i === 1) {
                hue = 120;
            } else {
                hue = 240;
            }
        } else if (splitInp.length === 4) {
            if (i === 0) {
                hue = 0;
            } else if (i === 1) {
                hue = 49;
            } else if (i === 2) {
                hue = 120;
            } else {
                hue = 240;
            }
        } else {
            hue = i * (256 / (splitInp.length - 1));
        }

        let color = `hsl(${hue}, 30%, 30%)`;

        outputClip.style.backgroundColor = color;

        outputClip.style.borderColor = color;

        //

        outputItem.appendChild(outputClip);

        outputItem.appendChild(outputText);

        output.appendChild(outputItem);
    }
}

function selectOutput(i: number) {
    let outputText = <HTMLInputElement>(
        document.getElementById(`output-text-${i}`)
    );

    outputText.select();
    outputText.setSelectionRange(0, 99999);

    document.execCommand('copy');
}

function splitText(text: string): string[] {
    let out: string[] = [];

    return out;
}
