# 这是什么?
- 这是 [Lazy's Live](https://live.lazy.ink) 的源码。
- 这玩意主要是针对像我这种家里不仅有公网还有服务器的人使用，，，，
- ~~所以应该没多少人会对这个东西感兴趣吧，毕竟写得跟个屎山一样~~

## 功能
1. 和朋友一起看直播，视频，电影等
2. 简单暴力的聊天系统(一个跑在Nodejs上的Websocket服务)
3. 实时在线人数统计(需要登录帐号)
4. 类似弹幕姬（`chat.html`）

## 运行环境
1. 前端网页: 任意 Web 服务器均可
2. 后端聊天服务器: `Nodejs`
3. 账号系统： `Blessing Skin`的`Yggdrasil API`

## 如何安装
### 前端网页
1. 克隆本仓库到本地
2. 根据需要修改`index.html`里的内容（我相信你看得懂）
3. 上传到你的网站目录即可

### 聊天服务器
1. 克隆仓库到本地
2. 根据你的需要修改`s.js`
3. `npm i`
4. `node s.js`

### 弹幕姬
这里使用 [Nativefier](https://github.com/nativefier/nativefier) 工具将`chat.html`打包成 .exe 并设置为最上层显示（代码仅供参考）
```bash
nativefier --name "LiveChat" --always-on-top true --portable true --disable-dev-tools true "https://live.lazy.ink/chat.html"
```

### 推流服务器
自己百度搜（或者`v`我50帮你解决）

## BUG列表
1. 聊天区不会自动清空

## 为啥开源
1. 我满18了

## 温馨提示
1. 聊天服务器默认是`http`协议，如果需要`https`请手搓`s.js`或者反向代理（估计我有注释）
3. 仅支持观看单用户直播(如果需要多人，请手动搓html)

## 一些说明
#### 你可以
 1. 在保留原作者和出处的情况下自由转载和修改
 2. 赞助我qwq
#### 你不可以
 1. 说这个网站是你自己做的
 2. 未经授权私自转载或倒卖
 3. 抹掉所有的版权信息

## 最后
如果你觉得这个项目不错欢迎给个`Star`。当然，人嘛，饿了总是要吃饭的...如果你通过下面的二维码向我赞助，我会更加开心！~~0.01也是爱~~
![img](https://qn-store-pub-tx.seewo.com/676b69a1b8ad4f9391555c127a2331c7165760252223383)