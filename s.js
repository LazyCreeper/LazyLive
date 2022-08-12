/*
  Lazy's Live Websocket Server
  Copyright 2022 Lazy All rights reserved.
*/
const WebSocketServer = require("ws").Server;
var http = require("http");
var url = require("url");
var rp = require("request-promise");

const cfg = {
  port: 8848,
  //ssl_key: process.cwd()+'/s1.imlazy.ink.key',
  //ssl_cert: process.cwd()+'/s1.imlazy.ink_bundle.crt'
};

const processRequest = (req, res) => {
  res.writeHead(200);
  res.end("Lazy's Live Websocket Server | reference: https://live.lazy.ink");
};

//const app = https.createServer({
// 向server传递key和cert参数
//    key: fs.readFileSync(cfg.ssl_key),
//    cert: fs.readFileSync(cfg.ssl_cert)
//}, processRequest).listen(cfg.port);

//const wss = new WebSocketServer({
//    server: app
//});

const app = http
  .createServer(
    {
      // 向server传递key和cert参数
      //key: fs.readFileSync(cfg.ssl_key),
      //cert: fs.readFileSync(cfg.ssl_cert)
    },
    processRequest
  )
  .listen(cfg.port);

const ws = new WebSocketServer({
  server: app,
});

//const server = ws.createServer(options,function (connect){
//连接上来的时候
//wss.on('connection', (connect) => {
console.log(`
██╗      █████╗ ███████╗██╗   ██╗  ██  ███████╗    ██╗     ██╗██╗   ██╗███████╗
██║     ██╔══██╗╚══███╔╝╚██╗ ██╔╝  ██  ██╔════╝    ██║     ██║██║   ██║██╔════╝
██║     ███████║  ███╔╝  ╚████╔╝       ███████╗    ██║     ██║██║   ██║█████╗  
██║     ██╔══██║ ███╔╝    ╚██╔╝        ╚════██║    ██║     ██║╚██╗ ██╔╝██╔══╝  
███████╗██║  ██║███████╗   ██║         ███████║    ███████╗██║ ╚████╔╝ ███████╗
╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝         ╚══════╝    ╚══════╝╚═╝  ╚═══╝  ╚══════╝
`)
console.log(" + Copyright 2022 Lazy All rights reserved\n + Version 2.0")
console.log("[WELCOME] 欢迎使用 Lazy's Live 聊天服务");
console.log("[INFO] 服务已启动，端口："+cfg.port);
ws.on("connection", (connect, reqData) => {
  var url233 = url.parse(reqData.url, true).query;
  var ok = JSON.parse(JSON.stringify(url233));
  if (!(ok.accessToken || ok.clientToken)) {
    console.log("用户未认证，令牌为空");
    connect.terminate();
    return;
  }
  //身份验证
  var options = {
    method: "POST",
    uri: "https://skin.fxcraft.cn/api/yggdrasil/authserver/validate",
    body: {
      accessToken: ok.accessToken,
      clientToken: ok.clientToken,
    },
    json: true,
  };

  rp(options)
    .then(function (suC) {
      console.log("认证成功，令牌有效");
    })
    .catch(function (err) {
      console.log(err);
      console.log("错误的令牌");
      connect.terminate();
      console.log(JSON.parse(url233));
    });

  connect.on("message", (str) => {
    if (typeof str == "string") {
      try {
        let data = JSON.parse(str);
        console.log("是字符串：" + data);
        return;
      } catch (e) {
        return;
      }
    } else {
      try {
        let data = JSON.parse(str);
        //console.log("是数组");
      } catch (e) {
        console.log("捕获到一条野生消息，已阻止");
        //console.log(e)
        return;
      }
    }
    let data = JSON.parse(str);
    console.log(data);
    switch (data.type) {
      case "setName":
        connect.nickname = data.nickname;
        clear_name = data.nickname
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
        
        boardcast(
          JSON.stringify({
            type: "serverInformation",
            // 发送xxx进入直播间弹幕
            message: clear_name + "进入直播间",
          })
        );

        boardcast(
          JSON.stringify({
            type: "chatterList",
            list: getAllChatter(),
          })
        );
        break;
      case "chat":
        connect.message = data.message;
        var clear_msg = data.message
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

        //clear_name = connect.nickname
        //.replace(/</g, "&lt;")
        //.replace(/>/g, "&gt;");
        
        boardcast(
          JSON.stringify({
            type: "chat",
            //ame: connect.nickname,
            name: clear_name,
            message: clear_msg,
          })
        );
        break;
      default:
        break;
    }
  });

  //关闭链接的时候
  connect.on("close", () => {
    //离开房间
    var clear_name = connect.nickname
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    boardcast(
      JSON.stringify({
        type: "serverInformation",
        message: clear_name + "离开直播间",
      })
    );

    //从在线聊天的人数上面除去
    boardcast(
      JSON.stringify({
        type: "chatterList",
        list: getAllChatter(),
      })
    );
  });

  //错误处理
  connect.on("error", (err) => {
    console.log(err);
  });
}); //.listen(8848,"127.0.0.1")

//封装发送消息的函数(向每个链接的用户发送消息)
const boardcast = (str) => {
  console.log(str);
  //wss.connection.forEach((connect)=>{
  ws.clients.forEach(function each(connect) {
    connect.send(str);
  });
  //wss.connections.forEach(function each(connect){
  //connect.sendText(str)
  //   connect.send(str)
  //})
};

//封装获取所有聊天者的nickname
const getAllChatter = () => {
  let chartterArr = [];
  //wss.connections.forEach((connect)=>{
  //    chartterArr.push({name:connect.nickname})
  //});
  ws.clients.forEach(function each(connect) {
    chartterArr.push({ name: connect.nickname });
  });
  return chartterArr;
};
