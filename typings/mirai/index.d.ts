interface IMiraiOptions {
  port: number;
  enableWebsocket: boolean;
  authKey: string;
  host: string;
  qq: string;
  enableMsg?: boolean
  enableEvent?: boolean
}

type IPlain = {
  type: "Plain";
  text: string;
};

type IImage = {
  type: "Image";
  imageId: string;
  url: string;
  path: any;
};

type IFace = {
  type: "Face";
  faceId: number;
  name: string;
};

type IAt = {
  type: "At";
  target: number;
  display: string;
};

type IAtAll = {
  type: "AtAll";
};

type IXml = {
  type: "Xml";
  xml: string;
};

type IQuote = {
  type: "Quote";
  id: number;
  groupId: number;
  senderId: number;
  origin: MessageChains;
};

type IApp = {
  type: "App";
  content: string;
};

type IMessageSource = {
  type: "Source";
  id: number;
  time: number;
};

type IJson = {
  type: "Json";
  json: string;
};

type MessageChains = Array<
  IPlain | IFace | IImage | IAt | IAtAll | IQuote | IXml | IJson
>;

type MessageChainGroup =
  | IPlain
  | IFace
  | IImage
  | IAt
  | IAtAll
  | IQuote
  | IXml
  | IApp
  | IJson
 ;

type MessageChainFriend =
  | IPlain
  | IFace
  | IImage
  | IQuote
  | IXml
  | IApp
  | IJson;


type IMessageChainGroup = Array<
  IMessageSource | MessageChainGroup
  >

type IMessageChainFriend = Array<
  IMessageSource | MessageChainFriend
>;

interface IMessageSenderPrivate {
  id: number;
  nickname: string;
  remark: string;
}

interface IMessageSenderGroup {
  id: number;
  memberName: string;
  permission: string;
  group: {
    id: number;
    name: string;
    permission: string;
  };
}

interface IMiraiMessagePrivate {
  type: "FriendMessage";
  messageChain: IMessageChainFriend;
  sender: IMessageSenderPrivate;
}

interface IMiraiMessageGroup {
  type: "GroupMessage";
  messageChain: IMessageChainGroup;
  sender: IMessageSenderGroup;
}

type BotEvents =
  | "BotOnlineEvent"
  | "BotOfflineEventForce"
  | "BotOfflineEventDropped"
  | "BotReloginEvent"
  | "BotReloginEvent"
  | "GroupRecallEvent"
  | "FriendRecallEvent"
  | "BotGroupPermissionChangeEvent"
  | "BotMuteEvent"
  | "BotUnmuteEvent"
  | "BotJoinGroupEvent"
  | "GroupNameChangeEvent"
  | "GroupEntranceAnnouncementChangeEvent"
  | "GroupMuteAllEvent"
  | "GroupAllowAnonymousChatEvent"
  | "GroupAllowConfessTalkEvent"
  | "GroupAllowMemberInviteEvent"
  | "MemberJoinEvent"
  | "MemberLeaveEventKick"
  | "MemberLeaveEventQuit"
  | "MemberCardChangeEvent"
  | "MemberSpecialTitleChangeEvent"
  | "MemberPermissionChangeEvent"
  | "MemberMuteEvent"
  | "MemberUnmuteEvent"
;

// event事件的结果暂时利用console.log
interface IMiraiEvent {
  type: BotEvents;
  [key: string]: any;
}
