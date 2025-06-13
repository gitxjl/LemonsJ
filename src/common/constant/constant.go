package constant

const (

	//group admin
	OrdinaryMember = 0
	GroupOwner     = 1
	Administrator  = 2
	//group application
	Application      = 0
	AgreeApplication = 1

	//feiend related
	BlackListFlag         = 1
	ApplicationFriendFlag = 0
	FriendFlag            = 1
	RefuseFriendFlag      = -1

	//Websocket Protocol
	WSGetNewestSeq     = 1001
	WSPullMsg          = 1002
	WSSendMsg          = 1003
	WSPullMsgBySeqList = 1004
	WSPushMsg          = 2001
	WSDataError        = 3001

	///ContentType
	//UserRelated
	Text           = 101
	Picture        = 102
	Voice          = 103
	Video          = 104
	File           = 105
	AtText         = 106
	Custom         = 110
	HasReadReceipt = 112
	Typing         = 113
	Common         = 200
	GroupMsg       = 201

	//SysRelated
	AcceptFriendApplicationTip = 201
	AddFriendTip               = 202
	RefuseFriendApplicationTip = 203
	SetSelfInfoTip             = 204
	Revoke                     = 205
	C2CMessageAsRead           = 206

	KickOnlineTip = 303

	TransferGroupOwnerTip       = 501
	CreateGroupTip              = 502
	GroupApplicationResponseTip = 503
	JoinGroupTip                = 504
	QuitGroupTip                = 505
	SetGroupInfoTip             = 506
	AcceptGroupApplicationTip   = 507
	RefuseGroupApplicationTip   = 508
	KickGroupMemberTip          = 509
	InviteUserToGroupTip        = 510

	//MsgFrom
	UserMsgType = 100
	SysMsgType  = 200

	//SessionType
	SingleChatType = 1
	GroupChatType  = 2
)

var ContentType2PushContent = map[int64]string{
	Picture:  "[图片]",
	Voice:    "[语音]",
	Video:    "[视频]",
	File:     "[文件]",
	Text:     "你收到了一条文本消息",
	AtText:   "[有人@你]",
	GroupMsg: "你收到一条群聊消息",
	Common:   "你收到一条新消息",
}

const FriendAcceptTip = "You have successfully become friends, so start chatting"
