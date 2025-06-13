# Open-IM-Server：100%开源通讯服务器

Open-IM是由前微信技术专家打造的开源通讯组件。Open-IM包括IM服务端和客户端SDK，实现了高性能、轻量级、易扩展等重要特性。开发者通过集成Open-IM组件，并私有化部署服务端，可以将即时通讯、实时网络能力快速集成到自身应用中，并确保业务数据的安全性和私密性。

即时通讯服务器。后端为纯 Golang，有线传输协议为 JSON over websocket。

Open-IM-Server中一切都是消息，因此您可以轻松扩展自定义消息，无需修改服务器代码。

使用微服务架构，可以使用集群部署 Open-IM-Server。

通过在客户服务器上部署Open-IM-Server，开发者可以免费、快速地将即时通讯和实时网络功能集成到自己的应用中，保证业务数据的安全和隐私。

## 特点

- **开源免费，给初创企业每年节省上万费用**

- **完整组件，一键部署，轻松集成**

- **轻松集成，可扩展架构，支持多种协议**

- **私有化部署，无任何关联**

- **高性能、微服务、集群化、轻量级**

- **方便定制，采用“一切皆消息”的通讯模型。**

  

## 社区

- **加入 Telegram-OpenIM 群：https://t.me/joinchat/zSJLPaHBNLZmODI1**
- **加入QQ群：https://jq.qq.com/?_wv=1027&k=4HTcUadb**
- **产品官网：https://www.rentsoft.cn** 
- **开发者社区：https://doc.rentsoft.cn/**



## 快速开始



### 安装 Open-IM-Server

> Open-IM 依赖于五个开源高性能组件：ETCD、MySQL、MongoDB、Redis 和 Kafka。私有化部署 在 Open-IM-Server 之前，请确保已经安装了以上五个组件。如果您的服务器没有上述组件，您必须先安装缺少的组件。如果你有以上组件，建议直接使用。如果没有，建议使用Docker-compose，无需安装依赖，一键部署，更快更方便。

### 源码部署

1. **安装[Go 环境](https://golang.org/doc/install)。确保 Go 版本至少为 1.15。**
2. **将 Open-IM 项目克隆到您的服务器。**

```
git clone https://github.com/OpenIMSDK/Open-IM-Server.git --recursive
```

3. **构建并启动服务**

- 外壳授权

```
#cd Open-IM-server/script

chmod +x *.sh
```

- 执行构建外壳

```
./build_all_service.sh
```

- 开始服务

```
./start_all.sh
```

- 检查服务

```
./check_all.sh
```



## Docker部署

所有图像均可在 https://hub.docker.com/r/lyt1123/open_im_server 获取到

### 1.1. 服务器配置

> Linux系统 8G及以上内存

### 1.2. 安装docker

要求docker版本1.13以上，docker-compose版本1.22以上

#### 1.将 Open-IM 项目克隆到您的服务器

```
git clone https://github.com/OpenIMSDK/Open-IM-Server.git --recursive
```

#### 2.拉取&启动

```
cd Open-IM-Server
docker-compose up -d
```

#### 3.检查

```
cd script
./docker_check_service.sh
```

![image-20210720174158535](https://doc.rentsoft.cn/images/deploy_docker_check.png)

如图所示，表示正常启动。

### 1.3. docker部署常见问题总结分析和解决办法

#### 1.check_all.sh显示有服务失败，docker-compose ps显示某些服务不处于Up状态

> 建议排查思路：1.如果连续执行check_all.sh都有失败，如果发现mongo的State处于Restaring状态，说明mongo运行不正常（由于版本问题导致）

解决方法：

```
1.docker-compose down
2.进入项目的目录的components/下，删除mongo的文件夹（正式线上保持一种版本，可以修改docker-compose中的mongo镜像版本）
3.检查docker images下所有镜像的版本，可以用docker rmi [IMAGE ID]删除老的镜像，比如：open_im_server和mongo的镜像
4.docker-compose up -d
```

#### 2.check_all.sh显示有服务失败，docker-compose ps显示所有组件up正常，查看openIM.log

> 建议排查思路：1.如果openIM.log中有mysql.go或者model.go的错误，一般情况是mysql初始化失败（部署环境中如果已经有MySQL的情况）

解决方法：

```
1.这种情况通过lsof -i:3306查看MySQL是否正常启动
2.进入config/config.yaml文件中修改mysql的用户和密码(已有MySQL的用户和密码)，或者关闭外部的MySQL
3.docker-compose retart 重启服务
```

> 建议排查思路：2.如果openIM.log中有mysql.go或者model.go的错误，一般情况是mysql初始化失败（全新系统，外部并没有安装过MySQL）

解决方法：

```
1.官方建议，混合启动，保持所有组件运行正常
2.安装go语言环境：wget -c https://dl.google.com/go/go1.17.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
3.进入项目script中执行chmod +x *.sh
4.执行./build_all_service.sh
5.执行./start_all.sh
6.执行./check_all.sh
```

正常情况如下：

![image-20211112140749182](https://doc.rentsoft.cn/images/docker_singe_qu.png)

### 1.4. docker部署更新镜像

#### 1.关闭服务

```
docker-compose down
```

#### 2.拉取新的镜像

```
docker-compose pull
```

#### 3.拉取最新配置文件和脚本文件

```
git pull
```

#### 4.重新启动服务

```
docker-compose up -d
```



**功能介绍以及更详细的部署请开发者自行查看开发者文档：https://doc.rentsoft.cn/introduce/mian_function.html**  

> 我们不是个人兼职项目， 是商业化全职团队运作会不停的优化使用中所发现的BUG，并根据合理情况采纳您宝贵的意见为了更好的交流可以在文档深度合作板块中查看到我们的联系电话以及微信，让我们的工作人员拉您进入到所在的微信群组。

