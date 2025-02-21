# result

A simple Result (either) type for TypeScript applications.

## You need this if

- You're building a TypeScript application.
- You have a function that could return data you need or an error.
- You want to detect errors easily.


## What it does

If a variable `x` is of type `Result<okType, errorType>` then either 

- `x.value !== null && x.error === null` or
- `x.value === null && x.error !== null`

There is no case where `x.value !== null and x.error !== null`

It is possible for `x.value === null and x.error === null` if `x = okResult(null)`, but only because you did it on purpose.

The code below acts as a type guard. Inside the `if`, `x.value === null`.
```typescript
if (x.error !== null) {
   // here, x.value === null and x.error is errorType

   return  // no way out if an error
}

// x.value !== null && x.error === null and x.value is okType
```

If you've ever coded Go, the pattern above should be familiar. The happy path is on the left and the error path is on the right (indented). You can choose the reverse pattern. Whichever you choose, consistency makes code easier to understand.

## How to use

- Declare the function to return a Result<okType, errorType>.
- Return an `okResult` or `errorResult`.
- `if (result.error !== null) { /* handle error */ }`

## Example

The example below uses primitive types, but `Result<DirEnt[], NotFoundError | IOError>` works too if you have complex types and custom error types.

```typescript
import { existsSync, lstatSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { errorResult, okResult, type Result } from '@jmjf/result';

// Declare the function to return a Result<okType, errorType>
export function getInputFiles(inPath: string): Result<string[], string> {
   if (!existsSync(inPath)) {
      // return an errorResult
      return errorResult(`ERROR: ${inPath} not found`);
   }

   if (!lstatSync(inPath).isDirectory()) {
      // return an okResult
      return okResult([path.resolve(inPath)]);
   }

   try {
      const fileNames = readdirSync(inPath).filter((fn) =>
         ['.yaml', '.yml', '.json'].includes(path.extname(fn).toLowerCase()),
      );
      if (fileNames.length === 0) {
         // return an errorResult
         return errorResult(`ERROR: no YAML or JSON files found in ${inPath}`);
      }
      // return an okResult
      return okResult(fileNames.map((fn) => path.resolve(inPath, fn)) as string[]);
   } catch (e) {
      // Result is handy for wrapping thrown errors
      // return an errorResult
      return errorResult(`ERROR: ${e.name} ${e.code} reading directory ${inPath}`);
   }
}

// a function that logs result
function getFirstInputFile(inPath: string) {
   const inputFilesResult = getInputFiles(inPath);
   if (inputFilesResult.error !== null) {
      console.log(inputFilesResult.error);
      return;
   }
   // because we returned in the if, value must be present
   console.log(inputFilesResult.value[0]);
}

// a function that returns a result based on the result it gets
function getInputFileCount(inPath: string): Result<number, string> {
   const inputFilesResult = getInputFiles(inPath);
   if (inputFilesResult.error !== null) {
      return inputFilesResult; 
      // this works because both errorTypes are the same
      // if errorTypes are different, convert it here
   }

   return okResult(inputFilesResult.value.length);
}
```
