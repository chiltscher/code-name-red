
import { readFileSync } from "fs";
import {join, resolve} from "path";
import { ProcessFile } from "./Utils/ProcessFile";
import { createServer } from "https";
import { readFile } from "fs/promises";
import { DecryptSourceFile } from "./Utils/DecryptSourceFile";
import { UnzipFile } from "./Utils/UnzipFile";


// some constant declarations
const ALGO = "aes-256-gcm";
const WORKROOT = resolve(join(__dirname, ".."));
const DATA_DIR = join(WORKROOT, "data");

// the secret key
const KEY_FILE_PATH = join(DATA_DIR, "secret.key");
console.log(`Using keyfile ${KEY_FILE_PATH}`);

// the initialisation vector
const IV_FILE_PATH = join(DATA_DIR, "iv.txt");
console.log(`Using inputvector ${IV_FILE_PATH}`);

// the file to decrypt
const SOURCE_FILE = join(DATA_DIR, "secret.enc");

const ZIP_FILE = join(WORKROOT, "out", "aint_no_secret.zip");
const UNZIPPED_FILE = join(WORKROOT, "out", "unzip.txt");

const TEST_FILE =join(DATA_DIR, "clear_smaller.txt");


async function Task1() {
    const key = (await readFile(KEY_FILE_PATH)).toString();
    const iv = await readFile(IV_FILE_PATH);

    await DecryptSourceFile({
        source: SOURCE_FILE,
        target: ZIP_FILE,
        algo: ALGO,
        key,
        iv
    }).catch((e) => {
        console.log("Task1: " + e);
    });
    await UnzipFile(ZIP_FILE, UNZIPPED_FILE);
}

async function main() {


    // [TASK 1] #######################################################################################################
    // await Task1();
    
    // Testfile will be processed!!
    // [TASK 2] [TASK 3] #######################################################################################################
    const {numberSum, vocalSum, sumArray} = await ProcessFile(TEST_FILE);
    // console.log(numberSum, vocalSum);
    // console.log(sumArray);


    // // task 4
    // just testing
    // const sum: number[] = [];
    // readFileSync(TEST_FILE).toString().split(".").forEach(sentence => {
    //     sum.push(sentence.match(/[0-9]/g)?.reduce((a, b) => a + parseInt(b), 0) || 0);
    // });

    // [TASK 4.A] #######################################################################################################
    const sum = [...sumArray];
    const compareFn = (a: number, b: number) => (a > b) ? -1 : (a < b) ? 1 : 0;
    const sortedMaximas = [...new Set(sum)].sort(compareFn).slice(0, 10);
    const maximasInOrder = [...new Set(sum)].filter(x => sortedMaximas.includes(x));
    const maximasInOrderSubIndex = [...maximasInOrder].map((m, i) => m-i);


    // [TASK 4.B] #######################################################################################################
    const result = String.fromCharCode(...maximasInOrderSubIndex);
    // should print the result
    // console.log(result);
    // console.log(...maximasInOrderSubIndex);


    // [TASK 4.C] #######################################################################################################

    createServer({
        key: readFileSync(join(WORKROOT, "cert", "localhost.key")),
        cert: readFileSync(join(WORKROOT, "cert", "localhost.crt"))
    }, (request, response) => {
        response.statusCode = 200;
        response.end(`<h1>Results</h1>
        <ul>
            <li>Task 2: The sum is <strong>${numberSum}</strong></li>
            <li>Task 3: The sum of the vocals is <strong>${vocalSum}</strong>. Added to task 2 the result is <strong>${numberSum + vocalSum}</strong></li>
            <li>Task 4: <strong>${result}</strong> ... does not seems to be a real word ...
        </ul>`);
    }).listen(8443);
}

main();