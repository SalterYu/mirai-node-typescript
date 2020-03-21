import Log from "./log";

export * from "./log";

const json5 = require('json5')
const fs = require('fs')
const path = require('path')

const delay: { [group_id in string]: { [func in string]: boolean } } = {}


const isEqualStr = (a: string, b: string) => a.trim() === b.trim()

const random = (min: number = 1, max: number = 10): number =>
  Math.floor(Math.random() * (max - min + 1)) + min

const addDelay = (group_id: number, funcName: string) => {
  if (!delay[group_id]) delay[group_id] = { [funcName]: true }
  else delay[group_id][funcName] = true
}

const deleteDelay = (group_id: number, funcName: string) => {
  delay[group_id][funcName] = false
}

function dateFtt(fmt: string, date: string) {
  //author: meizz
  const _date = new Date(date.replace('-', '/'));
  const o: any = {
    'M+': _date.getMonth() + 1, //月份
    'd+': _date.getDate(), //日
    'h+': _date.getHours(), //小时
    'm+': _date.getMinutes(), //分
    's+': _date.getSeconds(), //秒
    'q+': Math.floor((_date.getMonth() + 3) / 3), //季度
    S: _date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (_date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

function getConfig() {
  const defaultOptions: IMiraiOptions = {
    authKey: "",
    port: 8080,
    host: "127.0.0.1",
    enableWebsocket: false,
    qq: "",
    enableMsg: true,
    enableEvent: false
  };
  const _path = path.join(process.cwd(), './mirai-config.json')
  try {
    const file = fs.readFileSync(path.join(process.cwd(), './mirai-config.json'), 'utf8')
    const config: IMiraiOptions = json5.parse(file)
    return config
  } catch (e) {
    fs.writeFileSync(_path, JSON.stringify(defaultOptions, null, 2))
    Log.Error(`读取配置文件失败，已创建默认配置，请在${_path}下进行修改`)
    return null
  }
}

export {
  getConfig,
  dateFtt,
  isEqualStr,
  random,
  addDelay,
  deleteDelay,
  delay
}
