import { PathLike, createReadStream } from 'fs';

const VocalNumberMapping: { [x: string]: number } = {
    'a': 2,
    'e': 4,
    'i': 8,
    'o': 16,
    'u': 32
}

interface IFileResult {
    // result of task 2...
    numberSum: number;
    // ... task 3 ...
    vocalSum: number;
    // ... task 4
    sumArray: number[]
}

const VocalKeys = Object.keys(VocalNumberMapping);

export async function ProcessFile(sourcefile: PathLike) {
    return new Promise<IFileResult>((resolve, reject) => {
        const stream = createReadStream(sourcefile);
        let countNumbers = 0;
        let countVocals = 0;

        const sumArray: number[] = [];
        let sentence = "";
        let temp = "";

        stream.on('data', (chunk) => {
            const s = chunk.toString().toLowerCase();


            //#region 
            // this was just a try...
            //#################################################################

            // add the chunk if the sentence does not end in it
            if (!s.includes(".")) {
                sentence += s;
            } else {
                const partials = s.split(".");

                //  save the rest of the chunk in a temporary var if the sentence does not end
                if (s[s.length] !== ".") {
                    temp = partials.pop() + "";
                }
                /**
                 * create a new array with:
                 * - the sentece we saved before in addition with the part till the first '.' appears
                 * - the other partials if there are more than one sentence in this chunk
                 *
                 * Then find the numbers in every sentence and sum it up.
                 */
                [sentence += partials.shift(), ...partials].forEach(part => {
                    let localSum = 0;
                    part.match(/[0-9]/g)?.forEach(v => !isNaN(parseInt(v)) && (localSum += parseInt(v)))
                    sumArray.push(localSum);
                });

                sentence = temp;
                temp = "";
            }
            //#endregion

            s.match(/[aeiou]|[0-9]/g)?.forEach((x) => {
                VocalKeys.includes(x) && (countVocals += VocalNumberMapping[x]);
                !isNaN(parseInt(x)) && (countNumbers += parseInt(x));
            });
        });

        stream.on('error', (err) => {
            console.log(err.message);
            reject(0);
        });


        stream.on('end', () => {
            let localSum = 0;
            sentence.match(/[0-9]/g)?.forEach(v => !isNaN(parseInt(v)) && (localSum += parseInt(v)))
            sumArray.push(localSum);
            resolve({
                numberSum: countNumbers,
                vocalSum: countVocals,
                sumArray
            });
        });
    });
}