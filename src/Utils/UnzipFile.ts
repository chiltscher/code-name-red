import { createReadStream, createWriteStream, PathLike } from "fs";
import { createUnzip } from "zlib";

export async function UnzipFile(zipfile: PathLike, outfile: PathLike) {
    return new Promise<void>((res, rej) => {
        const unzip = createUnzip();
        const input = createReadStream(zipfile);
        const output = createWriteStream(outfile);
        output.on('close', () => {
            console.log("Unipped file");
            res();
        });
        input.pipe(unzip).pipe(output);
    })
}