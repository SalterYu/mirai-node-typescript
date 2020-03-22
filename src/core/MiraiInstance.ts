import axios from "../modules/axios";
import Log from "../utils/log";
import SignIn from "./SignIn";
import bus from "../utils/event-bus";
import { TypedEvent } from "../utils/typed-event";

const WebSocket = require("websocket").w3cwebsocket;

class MiraiInstance {
  options: IMiraiOptions;
  sessionKey: string;
  msgBus: TypedEvent<IMiraiMessagePrivate | IMiraiMessageGroup>;
  eventBus: TypedEvent<IMiraiEvent>;
  status: number; // 0 表示成功
  constructor(options: IMiraiOptions) {
    this.msgBus = new TypedEvent<IMiraiMessagePrivate | IMiraiMessageGroup>();
    this.eventBus = new TypedEvent<IMiraiEvent>();
  }

  /**
   * 初始化
   */
  protected async init() {
    this.sessionKey = await SignIn.auth(this.options.authKey);
    if (this.sessionKey) {
      this.status = await SignIn.verify({
        sessionKey: this.sessionKey,
        qq: this.options.qq
      });
    }
    if (this.status === 0) {
      this.start();
    }
  }

  /**
   * 监听消息
   */
  public async onListenMessage({
    msgCallback,
    eventCallback
  }: {
    msgCallback?: (msg: IMiraiMessagePrivate | IMiraiMessageGroup) => void;
    eventCallback?: (event: IMiraiEvent) => void
  }) {
    this.msgBus.on((msg: IMiraiMessagePrivate | IMiraiMessageGroup) => {
      msgCallback && msgCallback(msg)
    });
    this.eventBus.on((event: IMiraiEvent) => {
      eventCallback && eventCallback(event)
    });
  }

  private async _getWsHost() {
    const { enableEvent, enableMsg } = this.options;
    let wsHost = "";
    if (enableEvent && enableMsg) {
      wsHost = `ws://${this.options.host}:${this.options.port}/all?sessionKey=${this.sessionKey}`;
    } else if (!enableEvent && enableMsg) {
      wsHost = `ws://${this.options.host}:${this.options.port}/message?sessionKey=${this.sessionKey}`;
    } else if (enableEvent && !enableMsg) {
      wsHost = `ws://${this.options.host}:${this.options.port}/event?sessionKey=${this.sessionKey}`;
    }
    console.log(wsHost);
    return wsHost;
  }

  protected async start() {
    Log.Info("开始监听消息");
    const { sessionKey } = this;
    const url = `/fetchMessage?sessionKey=${sessionKey}&count=10`;
    if (this.options.enableWebsocket) {
      const self = this;
      const wsHost = await this._getWsHost();
      const client = new WebSocket(wsHost);
      client.onmessage = function(res: any) {
        const data = JSON.parse(res.data);
        const type = data.type;
        if (type.indexOf("Message") > -1) self.msgBus.emit(data);
        if (type.indexOf("Event") > -1) self.eventBus.emit(data);
      };
    } else {
      // 轮询暂时有问题
      setInterval(async () => {
        const res = await axios.get(url);
        console.log("res", res.data);
      }, 2000);
    }
    // const fetch = () => {
    //   setTimeout(async () => {
    //     const res = await axios.get(url)
    //     console.log('res', res.data)
    //     fetch()
    //   }, 3000)
    // }
    // fetch()
  }

  /**
   * 释放Session
   */
  public async release() {
    const { sessionKey } = this;
    const qq = this.options.qq;
    const url = "/release";
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

  /**
   * 发送好友消息
   * @param target 好友QQ
   * @param messageChain 消息链
   */
  public async sendFriendMessage({
    target,
    messageChain
  }: {
    target: number;
    messageChain: MessageChains;
  }) {
    const url = "/sendFriendMessage";
    const res = await axios.post<IResponse.ISendMsgResponse>(url, {
      sessionKey: this.sessionKey,
      target,
      messageChain
    });
    const data = res.data;
    if (data.code === 0) {
      Log.Info("发送成功");
      return data;
    } else {
      Log.Error("发送失败：", data.msg);
    }
  }

  /**
   * 发送群组消息
   * @param target 群号
   * @param messageChain 消息链
   */
  public async sendGroupMessage({
    target,
    messageChain
  }: {
    target: number;
    messageChain: MessageChains;
  }) {
    const url = "/sendGroupMessage";
    const res = await axios.post<IResponse.ISendMsgResponse>(url, {
      sessionKey: this.sessionKey,
      target,
      messageChain
    });
    const data = res.data;
    if (data.code === 0) {
      Log.Info("发送成功");
      return data;
    } else {
      Log.Error("发送失败：", data.msg);
    }
  }

  /**
   * 发送消息
   * @param qq
   * @param groupId 群号
   * @param messageChain 消息链
   */
  public async sendMessage({
    qq,
    groupId,
    messageChain
  }: {
    qq?: number;
    groupId: number;
    messageChain: MessageChains;
  }) {
    if (qq) {
      this.sendFriendMessage({
        target: qq,
        messageChain
      });
    }
    if (groupId) {
      this.sendGroupMessage({
        target: groupId,
        messageChain
      });
    }
  }

  /**
   * 发送图片消息（通过URL）使用此方法向指定对象（群或好友）发送图片消息 除非需要通过此手段获取imageId，否则不推荐使用该接口
   * @param sessionKey
   * @param target
   * @param qq
   * @param groupId
   * @param urls
   */
  public async sendImageMessage({
    target,
    qq,
    groupId,
    urls
  }: {
    target: number;
    qq: number;
    groupId: number;
    urls: string[];
  }) {
    const url = "/sendImageMessage";
    const res = await axios.post<IResponse.ISendImageMessage>(url, {
      sessionKey: this.sessionKey,
      target,
      qq,
      groupId,
      urls
    });
    return res.data;
  }

  /**
   * 撤回消息
   * @param sessionKey
   * @param messageId 消息ID
   */
  public async recall({ messageId }: { messageId: number }) {
    const url = "/recall";
    const res = await axios.post<{
      code: number;
      msg: string;
    }>(url, {
      sessionKey: this.sessionKey,
      messageId
    });
    return res.data;
  }

  /**
   * 通过messageId获取一条被缓存的消息,当该messageId没有被缓存或缓存失效时，返回code 5(指定对象不存在)
   * @param sessionKey
   * @param id
   */
  public async getMessageFromId(id: number) {
    const url = `/messageFromId?sessionKey=${this.sessionKey}&id=${id}`;
    const res = await axios.get<
      IMiraiMessagePrivate | IMiraiMessageGroup | IMiraiEvent
    >(url);
    return res.data;
  }

  /**
   * 获取好友列表
   */
  public async getFriendList() {
    const url = `/friendList?sessionKey=${this.sessionKey}`;
    const res = await axios.get<
      Array<{ id: number; nickname: string; remark: string }>
    >(url);
    return res.data;
  }

  /**
   * 获取群列表
   */
  public async getGroupList() {
    const url = `/groupList?sessionKey=${this.sessionKey}`;
    const res = await axios.get<
      Array<{ id: number; name: string; permission: string }>
    >(url);
    let hash: any = {};
    // 去重
    return res.data.reduce((pre, cur) => {
      if (!hash[cur.id]) {
        hash[cur.id] = true;
        pre.push(cur);
        return pre;
      }
      return pre;
    }, []);
  }

  /**
   * 获取群列表
   * @param groupId
   */
  public async getMemberList(
    groupId: number
  ): Promise<{
    id: number;
    memberName: string;
    permission: string;
    group: {
      id: number;
      name: string;
      permission: string;
    };
  }> {
    const url = `/memberList`;
    const res = await axios({
      url,
      method: "get",
      params: {
        target: groupId,
        sessionKey: this.sessionKey
      }
    });
    return res.data;
  }

  /*
   * 群禁言
   * @param groupId
   */
  public async setMuteAll(groupId: number) {
    const url = "/muteAll";
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      target: groupId
    });
    return res.data;
  }

  /**
   * 取消群禁言
   * @param groupId
   */
  public async unMuteAll(groupId: number) {
    const url = "/unmuteAll";
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      target: groupId
    });
    return res.data;
  }

  /**
   * 禁言某人, time为0表示取消禁言
   * @param groupId
   * @param memberId
   * @time number 禁言时间
   */
  public async mute(groupId: number, memberId: number, time: number) {
    const url = `/mute`;
    if (time <= 0) {
      return this.unMute(groupId, memberId);
    }
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      target: groupId,
      sessionKey: this.sessionKey,
      memberId,
      time: time || 0
    });
    return res.data;
  }

  /**
   * 解除某人禁言
   * @param groupId
   * @param memberId
   */
  public async unMute(groupId: number, memberId: number) {
    const url = `/unmute`;
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      sessionKey: this.sessionKey,
      target: groupId,
      memberId
    });
    return res.data;
  }

  /**
   * 移除群成员
   * @param groupId
   * @param memberId
   */
  public async kick(groupId: number, memberId: number, msg = "您已被移出群聊") {
    const url = "/kick";
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      sessionKey: this.sessionKey,
      target: groupId,
      memberId,
      msg
    });
    return res.data;
  }

  /**
   *
   * @param groupId 群名
   * @param allowMemberInvite 是否运行群员邀请
   * @param confessTalk 是否开启坦白说
   * @param announcement 群公告
   * @param anonymousChat 是否允许匿名聊天
   * @param autoApprove 是否开启自动审批入群
   * @param name
   */
  public async setGroupConfig({
    groupId,
    allowMemberInvite,
    confessTalk,
    announcement,
    anonymousChat,
    autoApprove,
    name
  }: {
    groupId: number;
    name: string;
    announcement: string;
    confessTalk: boolean;
    allowMemberInvite: boolean;
    autoApprove: boolean;
    anonymousChat: boolean;
  }) {
    const url = `/groupConfig`;
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      target: groupId,
      sessionKey: this.sessionKey,
      config: {
        allowMemberInvite,
        confessTalk,
        announcement,
        anonymousChat,
        autoApprove,
        name
      }
    });
    return res.data;
  }

  /**
   * 获取群设置
   * @param groupId
   */
  public async getGroupConfig(groupId: number): Promise<IGroupConfig> {
    const url = `/groupConfig`;
    const res = await axios({
      url,
      method: "get",
      params: {
        sessionKey: this.sessionKey,
        target: groupId
      }
    });
    return res.data;
  }

  /**
   * 设置群员信息
   * @param groupId
   * @param memberId
   * @param info
   */
  public async setMemberInfo({
    groupId,
    memberId,
    info
  }: {
    groupId: number;
    memberId: number;
    info: IGroupMemberInfo;
  }) {
    const url = `/memberInfo`;
    const res = await axios.post<IResponse.IResponseBase<"">>(url, {
      target: groupId,
      memberId,
      info
    });
    return res.data;
  }

  /**
   * 获取群员信息
   * @param groupId
   * @param memberId
   */
  public async getMemberInfo(
    groupId: number,
    memberId: number
  ): Promise<IGroupMemberInfo> {
    const url = `/memberInfo`;
    const res = await axios({
      url,
      method: "get",
      params: {
        sessionKey: this.sessionKey,
        target: groupId,
        memberId
      }
    });
    return res.data;
  }
}

export default MiraiInstance;
