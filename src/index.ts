import Mirai from './core'

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

export default Mirai

