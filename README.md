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

// Create a argument validator (string 2-10 chars)
let validator1 = AV.string().min(2).max(10);
const Parse = AV.Parse(message, validator1);

await Parse('MyString') // => Passes
await Parse('MyStringButLonger') // => Throws ArgParseError
```
