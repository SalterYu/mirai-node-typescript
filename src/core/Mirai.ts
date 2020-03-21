
import MiraiInstance from "./MiraiInstance";
import Log from "../utils/log";
import { getConfig } from "../utils";

const defaultOptions: IMiraiOptions = {
  authKey: "",
  port: 8080,
  host: "127.0.0.1",
  enableWebsocket: false,
  qq: "",
  enableMsg: true,
  enableEvent: false
};

class Mirai extends MiraiInstance {
  options: IMiraiOptions;
  sessionKey: string;
  status: number; // 0 表示成功

  constructor(options?: IMiraiOptions) {
    super(options);
    this.options = getConfig() || defaultOptions
    if (options) {
      Object.assign(this.options, options);
    }
    if (this._checkOptions()) {
      this.init();
      this.onListenMessage();
    }
  }

  private _checkOptions() {
    if (!this.options.qq) {
      Log.Error('配置内容没有写入bot的qq号')
      return false
    };
    if (!this.options.authKey) {
      Log.Error('配置内容没有authKey')
      return false;
    }
    return true
  }
}

export default Mirai;
