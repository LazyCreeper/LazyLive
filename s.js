/*
  Lazy's Live 聊天服务器
  根据自己需要进行修改
  如果你不想用wss那就自己改，别问我
  反正大部分都是百度的
*/
const WebSocketServer = require('ws').Server;
var https=require('https');
var fs=require('fs');

const cfg = {
    port: 8128,                            // 设置端口号
    ssl_key: process.cwd()+'/domain.key',  // 域名证书key
    ssl_cert: process.cwd()+'/domain.crt'  // 域名证书crt
};

const processRequest = (req, res) => {
    res.writeHead(200);
    res.end("Lazy's Live Websocket Server");
};

const app = https.createServer({
    // 向server传递key和cert参数
    key: fs.readFileSync(cfg.ssl_key),
    cert: fs.readFileSync(cfg.ssl_cert)
}, processRequest).listen(cfg.port);

const wss = new WebSocketServer({
    server: app
});

//const server = ws.createServer(options,function (connect){
    //连接上来的时候
//wss.on('connection', (connect) => {
wss.on('connection', (connect) =>{
	console.log('服务器已启动，监听中~');
    connect.on('message',(str)=>{
        let data = JSON.parse(str);
        console.log(data);
		//const usertokenn = data.usertoken;
        switch (data.type){
            case 'setName':
                connect.nickname = data.nickname;
                boardcast(
					JSON.stringify({ 
						type:'serverInformation',
                        // 发送xxx进入直播间弹幕
						message:data.nickname+"进入直播间",
					})
				);

                boardcast(JSON.stringify({
                    type:'chatterList',
                    list:getAllChatter()
                }));
            break;
			case 'chat':
                boardcast(JSON.stringify({
                    type:'chat',
                    name:connect.nickname,
                    message: data.message
                }));
            break;
            default:
            break;
        }
    });

    //关闭链接的时候
    connect.on('close',()=>{

        //离开房间
        boardcast(JSON.stringify({
            type:'serverInformation',
            // 发送xxx离开直播间弹幕
            message:connect.nickname+'离开直播间'
        }));

        //从在线聊天的人数上面除去
        boardcast(JSON.stringify({
            type:'chatterList',
            list: getAllChatter()
        }))
    });

    //错误处理
    connect.on('error',(err)=>{
        console.log(err);
    })

})//.listen(8848,"127.0.0.1")

//封装发送消息的函数(向每个链接的用户发送消息)
const boardcast = (str)=>{
    console.log(str);
    //wss.connection.forEach((connect)=>{
	wss.clients.forEach(function each(connect) {
		connect.send(str)
	})
    //wss.connections.forEach(function each(connect){
       //connect.sendText(str)
    //   connect.send(str)
    //})
};

//封装获取所有聊天者的nickname
const getAllChatter = ()=>{
    let chartterArr = [];
    //wss.connections.forEach((connect)=>{
    //    chartterArr.push({name:connect.nickname})
    //});
	wss.clients.forEach(function each(connect) {
		chartterArr.push({name:connect.nickname})
	})
    return chartterArr;
};