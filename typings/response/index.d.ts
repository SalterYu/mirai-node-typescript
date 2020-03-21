declare namespace IResponse {
  interface IResponseBase<T> {
    code: Number;
    data: T;
    msg: string;
  }

  interface IMraiAuth {
    code: number;
    session: string;
    msg: string;
  }

  interface ISendMsgResponse {
    code: number;
    messageId: number;
    msg: string;
  }

  interface ISendImageMessage {
    url: string[];
  }

  interface IResponseObj {
    code: number;
    msg: string;
  }
}

interface IGroupConfig {
  name: string;
  announcement: string;
  confessTalk: boolean;
  allowMemberInvite: boolean;
  autoApprove: boolean;
  anonymousChat: boolean;
}

interface IGroupMemberInfo {
  name: string;
  announcement: string;
}
