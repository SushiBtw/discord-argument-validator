# ArgumentValidator
> AV is a TypeScript validation library, created to handle Discord Arguments.
> It's simply-designed and allows you to manage all your commands. Feel free to contribute via PR's.

# Instalation
```shell
npm i discord-argument-validator
```

# Usage
```js
const AV = require('discord-argument-validator');
// import AV from 'discord-argument-validator';

// With single argument:
let validator1 = AV.string().min(2).max(10);
validator1.parse('MyString') // => Passes
validator1.parse('MyStringButLonger') // => Throws ArgParseError

// With more arguments:
let validator2 = AV.number().min(5);
const parse = AV.parse(validator1, validator2);

await parse(message, ['MyString', 5]) // => Passes
await parse(message, ['MyString', 1]) // => Throws ArgParseError
```
