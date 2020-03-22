mirai-node-typescript
======

#### work environment
```vue
mirai-console-wrapper-0.1.3-all.jar

mirai-api-http-v1.2.3.jar
```

<a href="https://github.com/mamoe/mirai-api-http">how to use mirai</a>

#### install
```vue
yarn add mirai-node-typescript
```

#### listen callback
```vue
mirai.onListenMessage({
  // msg  
  msgCallback(msg) {
    // do something
    console.log(msg)
  },
  // event
  eventCallback(event) {
    // do something
    console.log(event)
  }
})
```

#### use in typescript
```vue
import Mirai from 'mirai-node-typescript'

const mirai = new Mirai() // auto connect
```

#### use in js
```vue
const Mirai = require('mirai-node-typescript').default

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

### mirai-config.json配置说明
```vue
{
  "authKey": "", // 默认由插件随机生成，建议手动指定
  "port": 9999, // 端口
  "enableWebsocket": true, // 启用 websocket
  "host": "",
  "qq": "", // bot的qq
  "enableMsg": true, // 启用消息监听用于websocket
  "enableEvent": false // 启用事件监听用于websocket
}

```
