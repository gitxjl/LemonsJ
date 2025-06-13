package push

import (
	"Open_IM/src/common/config"
	"Open_IM/src/push/jpush/common"
	"Open_IM/src/push/jpush/requestBody"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type JPushResp struct {
}

func JGAccountListPush(accounts []string, content, detailContent, platform string) ([]byte, error) {

	var pf requestBody.Platform
	_ = pf.SetPlatform(platform)
	var au requestBody.Audience
	au.SetAlias(accounts)
	var no requestBody.Notification
	no.SetAlert(content)
	var me requestBody.Message
	me.SetMsgContent(detailContent)
	var po requestBody.PushObj
	po.SetPlatform(&pf)
	po.SetAudience(&au)
	po.SetNotification(&no)
	po.SetMessage(&me)

	con, err := json.Marshal(po)
	if err != nil {
		return nil, err
	}

	client := &http.Client{}

	req, err := http.NewRequest("POST", config.Config.Push.Jpns.PushUrl, bytes.NewBuffer(con))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", common.GetAuthorization(config.Config.Push.Jpns.AppKey, config.Config.Push.Jpns.MasterSecret))

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	result, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return result, nil
}
