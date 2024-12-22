# 基础镜像
FROM node:18-alpine

# 安装 tor 和 supervisor
RUN apk add --no-cache tor supervisor

# 创建工作目录
WORKDIR /app

# 复制项目文件
COPY package.json .
COPY src ./src
COPY config/torrc /etc/tor/torrc

# 安装依赖
RUN npm install

# 创建 supervisor 配置
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true

[program:tor]
command=tor -f /etc/tor/torrc
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:proxy]
command=node src/proxy.js
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

# 暴露代理端口
EXPOSE 10086

# 启动 supervisor
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]