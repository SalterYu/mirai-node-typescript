import axios from "../modules/axios";
import Log from "../utils/log";

class SignIn {
  static async auth(authKey: string) {
    if (!authKey) return;
    const url = "/auth";
    const res = await axios.post<IResponse.IMraiAuth>(url, {
      authKey: authKey
    });
    if (res.data.code === 0) {
      return res.data.session;
    } else {
      Log.Error(res.data.msg);
    }
    return null;
  }

  static async verify({ sessionKey, qq }: { sessionKey: string; qq: string }) {
    if (!sessionKey) return;
    const url = "/verify";
    const res = await axios.post(url, {
      sessionKey,
      qq
    });
    if (res.data.code === 0) {
      return res.data.code;
    } else {
      Log.Error(res.data.msg);
      return -1;
    }
  }
}

export default SignIn
