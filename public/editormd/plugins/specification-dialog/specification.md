
# 调用说明

## 请求

所有的请求方式（Method）均与动词相关：

- `GET`：获取资源
- `POST`：创建资源
- `PUT`：更新资源
- `PATCH`：更新资源的一个属性
- `DELETE`：删除资源
- `OPTIONS`：获取客户端能对资源做什么操作的信息

### 参数传入方式

如无特别说明，`GET` 请求参数需要放到 Url Query String 中：

```
GET https://petstore.com/api/v1/pets?pagesize=20
```

`POST/PUT/PATCH` 请求参数建议使用 JSON 格式将参数放到请求体中：

```json
PUT https://petstore.com/api/v1/pets/1
Content-Type: application/json
{
  "id": 1,
  "category": {
    "name": "金毛",
    "id": 1
  },
  "status": "available",
  "photoUrls": [
    "http://petstore.com/1.png"
  ],
  "name": "doggie",
  "isHealthy": true,
  "tags": [
    {
      "id": 1,
      "name": "狗狗"
    }
  ]
}
```

## 响应

成功响应中包含实体资源内容，如：

```json
[
  {
    "a": "xxx",
    "b": "xxx"
  },
  {
    "c": "xxx",
    "d": "xxx"
   }
]
```

# 认证

本 API 使用 OAuth 2.0 作为授权方式，OAuth 2.0 是一种授权协议，可让您的应用程序获取到宠物商店用户中的各种详细信息，而无需获取用户的密码。

您的应用程序在用户授权时会询问特定的[授权范围]()，并在用户批准后获得访问权限。

在您开始之前需要先[注册您的应用程序]()，注册完成后系统将分配给您唯一的 `Client ID` 和 `Client Secret`，用于 OAuth 授权。请注意，`Client Secret` 需要妥善保存，不可分享给他人。

## OAuth 流程

本 API 使用 OAuth 2.0 的 `Authorization Code` 模式作为获取 `Access Token` 方式。
![](https://demo-api.coding.net/api/share/image/13fb5306-5239-4f98-ac74-6a33dd1cf48b)

 OAuth 流程是获取 Access Token 的关键。在没有用户授权的情况下，接口访问方是无法获取任何服务资源的。

### 第 1 步 - 跳转用户授权

上图步骤 1 中，您的应用应将用户重定向到以下地址：

`https://petstore.com/oauth/authorize`

以下值应作为 `GET` 参数传递：

- `response_type`：授权类型，此处的值固定为 `code`（必选）
- `client_id`：在您注册应用程序时得到的 Client ID（必选）
- `scope`：请求权限范围，多个权限使用空格分隔（见下文）（必选）
- `redirect_uri`：授权完成后重定向至的 URL，即您的应用程序用于接受授权结果的地址（必选）
- `state`：完成授权后传回的唯一字符串，认证服务器会原封不动地返回这个值，防止伪造攻击（可选）

范例：

```
GET https://petstore.com/oauth/authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
      &scope=store%20pet&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```

### 第 2 步 - 使用授权码（code）将用户重定向到您的应用服务器

上图步骤 2 中，用户授权完成，将会重定向至 `redirect_uri` 指定的 URI，并带上以下参数：

- `code`：表示授权码（必选）
- `state`：如果步骤 1 客户端请求中包含该参数，步骤 2 重定向地址中也必须一模一样包含该参数（可选）

> 授权代码只能交换一次，并在签发后10分钟到期。该码与 client_id 是一一对应关系。

范例：

```
HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA
          &state=xyz
```

### 第 3 步 - 使用授权码（code）交换访问令牌（Access Token）

上图步骤 3 中，您的应用程序服务器可通过获取的授权码（code）请求 `/api/token` 接口以获取 Access Token。

接口地址如下：

`https://petstore.com/oauth/token`

接口参数如下：

- `grant_type`：表示使用的授权模式，此处的值固定为 `authorization_code`（必选）
- `code`：表示上一步获得的授权码（必选）
- `client_id`：在您注册应用程序时得到的 Client ID（必选）
- `client_secret` ：在您注册应用程序时得到的 Client Secret（必选）

范例：

```
POST https://petstore.com/oauth/token?grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA&client_id=s6BhdRkqt3&client_secret=cwouf803ghv3op4ch32cu39djfhwpuow
```

上图步骤 4 中，您将接收到一个包含访问令牌  `Access Token`（以及其他详细信息）的 JSON 响应，范例如下：

```JSON
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "access_token": "xoxp-23984754863-2348975623103",
    "expires_in": 86400,
    "scope": "store pet",
    "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA"
}
```

> 访问令牌默认 86400 秒过期，即 1 天，过期后您可继续使用刷新令牌（Refresh Token），通过刷新访问令牌接口 `/oauth/token?grant_type=refresh_token&refresh_token={Refresh Token}` 获取新的访问令牌。

### 第 4 步 - 使用访问令牌访问 API 资源

上图步骤 5 中，您可以使用访问令牌代表用户调用本文档对应权限（Scope）的 API 方法。

请求范例：

```
GET https://petstore.com/api/v1/pets?token=xoxp-23984754863-2348975623103
```

若访问令牌有效，宠物商店服务端将返回给应用程序对应的宠物列表。

## 作用域 Scopes

作用域允许你提供你想要的资源类型，这些将在用户授权表单页面显示。

对应的作用域可在对应接口文档中找到。

# 请求限制

为了防止拒绝服务攻击，宠物商店 API 制定了一定的限流策略，规则如下：

- 访问令牌无效的请求，每分钟可请求 10 次
- 访问令牌有效的请求，每分钟可请求 300 次

为了方便您查询当前限流的情况，你可通过响应的 Header 的 Rate Limit 参数查看，参数如下：

- `X-RateLimit-Remaining`： 剩余可请求数量
- `X-RateLimit-Limit`：限制可请求数量
- `X-Ratelimit-Reset`： 重置限制次数时间（秒）
- `X-Ratelimit-Retry-After`：触达限流后需要等待重置的时间（秒）

范例：

```
X-RateLimit-Remaining: 298
X-RateLimit-Limit: 300
X-Ratelimit-Reset: 580
```

超出限流限制会返回如下错误：

```
Header:
X-RateLimit-Remaining: 0
X-RateLimit-Limit: 300
X-Ratelimit-Reset: 230
X-Ratelimit-Retry-After: 360

{
  "message": "操作过于频繁，请稍后再试。"
}

```

# 错误

宠物商店 API 使用标准 HTTP 响应码（Status Code）来表示 API 请求。

通常，状态码：

- `2xx` 代表成功响应
- `4xx` 代表失败响应，并给出失败原因
- `5xx` 代表宠物商店服务端内部错误

## 状态码说明

| 状态码 | 描述                                            |
| ------ | ----------------------------------------------- |
| 200    | 更新/获取资源成功                               |
| 201    | 创建资源成功                                    |
| 204    | 删除资源成功                                    |
| 400    | 业务错误，具体参见下放业务错误代码              |
| 401    | 认证失败，请返回 [认证](#认证) 检查参数是否有误 |
| 403    | 无权限调用接口，如：未开通 API 功能             |
| 404    | 资源不存在                                      |
| 405    | 接口请求方式 `Method` 有误                      |
| 422    | 请求参数校验失败                                |
| 429    | 触达限流限制                                    |
| 500    | 服务器应用发生了错误                    |
| 502    | 服务器无法连接                          |
| 503    | 服务器暂不可用                          |
| 504    | 服务器连接超时                          |

## 业务错误说明

状态码 `4xx` 的业务错误可通过编码来分别处理不同的处理逻辑，响应将通过 JSON 形式返回，其中包括业务错误码 `code` 和错误原因 `message`，例如：

```JSON
{
  "code": 3001,
  "type": "ERROR",
  "message": "用户名已被占用，请更改后重新提交"
}

```

业务错误码 `code` 说明如下：

- 状态码 400

| 错误码 | 描述                                 |
| ------ | ------------------------------------ |
| 3000 | 用户名或密码错误 |
| 3001 | 用户名已被占用，请更改后重新提交 |

- 状态码 422

| 错误码 | 描述                                 |
| ------ | ------------------------------------ |
| 2000 | categoryId 必填 |
| 2001 | categoryId 必须为 int |
| 2002 | petId 必须为整数 |
| 2003 | pagesize 必须大于 0 |
| 2004 | status 不存在，必须为 placed, approevd, delivered 其中之一 |
| 2005 | password 必填 |

# 版本

在极少数情况下，我们需要针对某些接口做一些破坏性的修改，为了尽量避免破坏向后兼容性，我们通过修改接口版本号来实现多版本共存，不去破坏上一版本的接口参数及逻辑，以新版本接口的形式提供同一接口不同请求或返回形式。

例如，`/api/v1/users` 升级后将变成 `/api/v2/users`

# 字段类型

在文档中，我们将使用许多不同类型的数据。您可以在下方的说明列表找到它们的解释及含义。

| 类型    | 定义                                                         | 范例                        |
| ------- | ------------------------------------------------------------ | --------------------------- |
| int | 整数，不带小数的数字。                                       | 1234                        |
| float   | 浮点数，带小数的数字。                                       | 1234.12                     |
| string  | 字符串是用于表示文本的字符序列。                             | "CODING"                    |
| boolean | 布尔值，是 `true` 或 `false` 中的一个，所对应的关系就是真与假的概念。 | true                        |
| time    | 表示日期和时间的字符串。                                     | "2017-09-10 12:23:01"       |
| array | 列表，该列表为数组，数组中的每一项的类型由中括号内的字段类型决定。 | ["CODING", "VERY", "GOOD"]  |
| object  | 资源，可从对应的资源 XX 对象中找到。                         | {"id": 1,"name": "NPC小明"}

