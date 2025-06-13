/*
** description("将日志发送到elasticsearch的hook").
** copyright('tuoyun,www.tuoyun.net').
** author("fg,Gordon@tuoyun.net").
** time(2021/3/26 17:05).
 */
package log

import (
	"Open_IM/src/common/config"
	"context"
	"fmt"
	elasticV7 "github.com/olivere/elastic/v7"
	"github.com/sirupsen/logrus"
	"log"
	"os"
	"strings"
	"time"
)

//esHook 自定义的ES hook
type esHook struct {
	moduleName string
	client     *elasticV7.Client
}

//newEsHook 初始化
func newEsHook(moduleName string) *esHook {
	//https://github.com/sohlich/elogrus
	//client, err := elastic.NewClient(elastic.SetURL("http://localhost:9200"))
	//if err != nil {
	//	log.Panic(err)
	//}
	//hook, err := elogrus.NewAsyncElasticHook(client, "localhost", logrus.DebugLevel, "mylog")
	//if err != nil {
	//	log.Panic(err)
	//}
	es, err := elasticV7.NewClient(
		elasticV7.SetURL(config.Config.Log.ElasticSearchAddr...),
		elasticV7.SetBasicAuth(config.Config.Log.ElasticSearchUser, config.Config.Log.ElasticSearchPassword),
		elasticV7.SetSniff(false),
		elasticV7.SetHealthcheckInterval(60*time.Second),
		elasticV7.SetErrorLog(log.New(os.Stderr, "ES:", log.LstdFlags)),
	)

	if err != nil {
		log.Fatal("failed to create Elastic V7 Client: ", err)
	}

	//info, code, err := es.Ping(logConfig.ElasticSearch.EsAddr[0]).Do(context.Background())
	//if err != nil {
	//	panic(err)
	//}
	//fmt.Printf("Elasticsearch returned with code %d and version %s\n", code, info.Version.Number)
	//
	//esversion, err := es.ElasticsearchVersion(logConfig.ElasticSearch.EsAddr[0])
	//if err != nil {
	//	panic(err)
	//}
	//fmt.Printf("Elasticsearch version %s\n", esversion)
	return &esHook{client: es, moduleName: moduleName}
}

//Fire log hook interface 方法
func (hook *esHook) Fire(entry *logrus.Entry) error {
	doc := newEsLog(entry)
	go hook.sendEs(doc)
	return nil
}

//Levels log hook interface 方法,此hook影响的日志
func (hook *esHook) Levels() []logrus.Level {
	return logrus.AllLevels
}

//sendEs 异步发送日志到es
func (hook *esHook) sendEs(doc appLogDocModel) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("send entry to es failed: ", r)
		}
	}()
	_, err := hook.client.Index().Index(hook.moduleName).Type(doc.indexName()).BodyJson(doc).Do(context.Background())
	if err != nil {
		log.Println(err)
	}

}

//appLogDocModel es model
type appLogDocModel map[string]interface{}

func newEsLog(e *logrus.Entry) appLogDocModel {
	ins := make(map[string]interface{})
	ins["level"] = strings.ToUpper(e.Level.String())
	ins["time"] = e.Time.Format("2006-01-02 15:04:05")
	for kk, vv := range e.Data {
		ins[kk] = vv
	}
	ins["tipInfo"] = e.Message

	return ins
}

// indexName es index name 时间分割
func (m *appLogDocModel) indexName() string {
	return time.Now().Format("2006-01-02")
}
