const Mirai = require('mirai-node-typescript').default

const mirai = new Mirai()

// 监听事件
mirai.onListenMessage({
  msgCallback(msg) {
    // do something
    console.log(msg)
  },
  eventCallback(event) {
    // do something
    console.log(event)
  }
})
