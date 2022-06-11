function buttonPress(): void {
    const output = document.getElementById('output')!;

    output.textContent = '';

    const inp = <HTMLInputElement>document.getElementById('input');

    const input = inp.value;

    const options = {
        break: (<HTMLInputElement>document.querySelector('input[name="break"]:checked')).value
    };

    const splitInp = splitText(input, 2000, options);

    console.log(splitInp);

    for (let i = 0; i < splitInp.length; i++) {
        const outputItem = document.createElement('div');

        outputItem.classList.add('output-item');

        //

        const outputText = document.createElement('textarea');

        //outputText.setAttribute('readonly', 'readonly');

        outputText.setAttribute('rows', '10');

        outputText.setAttribute('id', `output-text-${i}`);

        outputText.value = splitInp[i];

        outputText.classList.add('output-text');

        //

        const outputClip = document.createElement('button');

        outputClip.setAttribute('onclick', `selectOutput(${i})`);

        outputClip.classList.add('copy-button');

        outputClip.innerText = 'Copy';

        let hue = 0;

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

        const color = `hsl(${hue}, 30%, 30%)`;

        outputClip.style.backgroundColor = color;

        outputClip.style.borderColor = color;

        //

        outputItem.appendChild(outputClip);

        outputItem.appendChild(outputText);

        output.appendChild(outputItem);
    }
}

function selectOutput(i: number) {
    const outputText = <HTMLInputElement>(
        document.getElementById(`output-text-${i}`)
    );

    outputText.select();
    outputText.setSelectionRange(0, 99999);

    document.execCommand('copy');
}

function splitText(input: string, maxLength: number, options: { break: string; }): string[] {
    console.log(options.break);

    if (options.break === 'bc') {
        const out = <string[]>input.match(new RegExp(`(.|[\r\n]){1,${maxLength}}`, 'g'));
        return out;
    }

    let out: string[] = [''];

    let strings: string[] = [];

    if (options.break === 'bw') {
        strings = <string[]>input.match(/[^\s]+\s?|\s/g);
    } else {
        strings = <string[]>input.match(/[^(\r|\n)]+(\r|\n)?|(\r|\n)/g);
    }

    console.log('strings:', strings);

    for (const str of strings) {
        console.log(out[out.length - 1], str);

        if ((out[out.length - 1] + str).length <= maxLength) {
            out[out.length - 1] += str;

        } else if (str.length <= maxLength) {
            out[out.length - 1] = out[out.length - 1];
            out.push(str);

        } else {
            const outLast = out.pop()!;

            let newOptions = options;

            if (options.break === 'bw') {
                newOptions = Object.assign({}, options, { break: "bc" });
            } else {
                newOptions = Object.assign({}, options, { break: "bw" });
            }

            out = out.concat(splitText(outLast.concat(str), maxLength, newOptions));
        }

        console.log('out:', out);
    }

    return out;
}
