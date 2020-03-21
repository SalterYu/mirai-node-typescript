mirai-node-typescript
======

#### install
```vue
yarn add mirai-node-typescript
```

#### use in typescript
```vue
import Mirai from 'mirai-node-typescript'

const mirai = new Mirai() // auto connect
```

#### use in js
```vue
const Mirai = require('mirai-node-typescript')

const mirai = new Mirai()  // auto connect
```

#### use with origin code

##### install ts-node and tsconfig-paths
```vue
yarn add ts-node
yarn add tsconfig-paths
```

##### add script in package.json
```vue
 "scripts": {
    "server": "ts-node --project ./tsconfig.json -r tsconfig-paths/register ./src/index.ts",
    "dev": "ts-node-dev --project ./tsconfig.json -r tsconfig-paths/register ./src/index.ts"
  },
```

##### demo tsconfig.json
```vue
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "commonjs",
    "outDir": "./lib/",
    "rootDir": "./src",
    "target": "es6",
    "lib": [
      "es2019"
    ],
    "declaration": true,
    "declarationDir": "./lib",
    "allowJs": true,
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "typeRoots": [
      "typings",
      "node_modules/@types"
    ],
    "baseUrl": "."
  },
  "include": [
    "./src",
    "typings"
  ],
  "exclude": [
    "node_modules"
  ]
}

```