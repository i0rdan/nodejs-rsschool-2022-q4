# Node.js basics

## Subtasks

### File system (src/fs)

- `create.js` - function that creates new file `fresh.txt` with content `I am fresh and young` inside of the `files` folder (if file already exists `Error` with message `FS operation failed` thrown)
- `copy.js` - function that copies folder `files` files with all its content into folder `files_copy` at the same level (if `files` folder doesn't exists or `files_copy` has already been created `Error` with message `FS operation failed` thrown)
- `rename.js` - function that renames file `wrongFilename.txt` to `properFilename` with extension `.md` (if there's no file `wrongFilename.txt` or `properFilename.md` already exists `Error` with message `FS operation failed` thrown)
- `delete.js` - function that deletes file `fileToRemove.txt` (if there's no file `fileToRemove.txt` `Error` with message `FS operation failed` thrown)
- `list.js` - function that prints all array of filenames from `files` folder into console (if `files` folder doesn't exists `Error` with message `FS operation failed` thrown)
- `read.js` - function that prints content of the `fileToRead.txt` into console (if there's no file `fileToRead.txt` `Error` with message `FS operation failed` thrown)

### Command line interface(src/cli)

- `env.js` - function that parses environment variables with prefix `RSS_` and prints them to the console in the format `RSS_name1=value1; RSS_name2=value2`
- `args.js` - function that parses command line arguments (given in format `--propName value --prop2Name value2`) and prints them to the console in the format `propName is value, prop2Name is value2`

### Modules(src/modules)

- `cjsToEsm.cjs` - rewriting equivalent in ECMAScript notation (and rename it to `esm.mjs`)

### Hash (src/hash)

- `calcHash.js` - function that calculates SHA256 hash for file `fileToCalculateHashFor.txt` and logs it into console as `hex`

### Streams (src/streams)

- `read.js` - function that reads file `fileToRead.txt` content using Readable Stream and prints it's content into `process.stdout`
- `write.js` - function that writes `process.stdin` data into file `fileToWrite.txt` content using Writable Stream
- `transform.js` - function that reads data from `process.stdin`, reverses text using Transform Stream and then writes it into `process.stdout`

### Zlib (src/zip)

- `compress.js` - function that compresses file `fileToCompress.txt` to `archive.gz` using `zlib` and Streams API
- `decompress.js` - function that decompresses `archive.gz` back to the `fileToCompress.txt` with same content as before compression using `zlib` and Streams API

### Worker Threads (src/wt)

- `worker.js` - function works with data received from main thread and implement function which sends result of the computation to the main thread
- `main.js` - function that creates number of worker threads (equal to the number of host machine logical CPU cores) from file `worker.js` and able to send data to those threads and to receive result of the computation from them. You should send incremental number starting from `10` to each `worker`. For example: on host machine with **4** cores you should create **4** workers and send **10** to first `worker`, **11** to second `worker`, **12** to third `worker`, **13** to fourth `worker`. After all workers will finish, function should log array of results into console. The results are array of objects with 2 properties:
    - `status` - `'resolved'` in case of successfully received value from `worker` or `'error'` in case of error in `worker`
    - `data` - value from `worker` in case of success or `null` in case of error in worker  

The results in the array must be in the same order that the workers were created

### Child Processes (src/cp)

- `cp.js` - function `spawnChildProcess` that receives array of arguments `args` and creates child process from file `script.js`, passing these `args` to it. This function should create IPC-channel between `stdin` and `stdout` of master process and child process:
    - child process `stdin` should receive input from master process `stdin`
    - child process `stdout` should send data to master process `stdout`
