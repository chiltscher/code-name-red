import { createDecipheriv } from "crypto";
import { createReadStream, createWriteStream, PathLike } from "fs";


interface IDecryptOptions {
    algo: string;
    source: PathLike;
    target: PathLike;
    key: string;
    iv: Buffer;
}

export async function DecryptSourceFile({source, target, key, iv, algo}: IDecryptOptions) {
    return new Promise<void>(async (res, rej) => {

        console.log(key.length);

        const decipher = createDecipheriv(algo, key, iv);

        const input = createReadStream(source);
        const output = createWriteStream(target);

        input.on("data", (chunk) => {
        })

        decipher.on('error', (err) => {
            console.log(err.message);
        });

        decipher.on('end', () => {
            decipher.final('utf8');
        });

        output.on('close', () => {
            console.log("Wrote file")
            res()
        })

        input.pipe(decipher).pipe(output);
    })
}