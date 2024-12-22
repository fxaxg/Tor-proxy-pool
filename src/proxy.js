const net = require('net');
const SocksClient = require('socks').SocksClient;

const TOR_PORTS = Array.from({ length: 10 }, (_, i) => 38801 + i);
let currentTorIndex = 0;

const server = net.createServer(async (clientSocket) => {
    clientSocket.once('data', async (data) => {
        // SOCKS5 初始握手
        if (data[0] !== 0x05) {
            clientSocket.end();
            return;
        }

        // 响应支持无认证
        clientSocket.write(Buffer.from([0x05, 0x00]));

        // 等待连接请求
        clientSocket.once('data', async (data) => {
            const cmd = data[1];
            const atyp = data[3];
            
            let targetPort, targetAddr;
            
            // 解析目标地址和端口
            switch (atyp) {
                case 0x01: // IPv4
                    targetAddr = `${data[4]}.${data[5]}.${data[6]}.${data[7]}`;
                    targetPort = data.readUInt16BE(8);
                    break;
                case 0x03: // Domain
                    const domainLen = data[4];
                    targetAddr = data.slice(5, 5 + domainLen).toString();
                    targetPort = data.readUInt16BE(5 + domainLen);
                    break;
                default:
                    clientSocket.end();
                    return;
            }

            try {
                // 轮询选择 Tor 端口
                const torPort = TOR_PORTS[currentTorIndex];
                currentTorIndex = (currentTorIndex + 1) % TOR_PORTS.length;

                const socksOptions = {
                    proxy: {
                        host: '127.0.0.1',
                        port: torPort,
                        type: 5
                    },
                    command: 'connect',
                    destination: {
                        host: targetAddr,
                        port: targetPort
                    }
                };

                const info = await SocksClient.createConnection(socksOptions);
                
                // 发送成功响应
                clientSocket.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
                
                // 建立双向管道
                clientSocket.pipe(info.socket);
                info.socket.pipe(clientSocket);

            } catch (err) {
                console.error('连接错误:', err);
                clientSocket.end();
            }
        });
    });
});

server.listen(10086, '0.0.0.0', () => {
    console.log('代理服务器运行在端口 10086');
}); 