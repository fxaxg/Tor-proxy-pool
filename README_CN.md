# [中文](README_CN.md) | [English](README.md)

# Tor 代理池服务 🌐

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](Dockerfile)

一个基于 Tor 网络的代理池服务，可以将多个 Tor 实例的 IP 地址轮询，提供一个稳定的代理服务。

## ✨ 特性

- 🔄 自动轮询多个 Tor 实例（默认 10 个）
- 🔒 支持 SOCKS5 代理协议
- 🚀 简单的 Docker 部署
- ⚡ 自动切换 IP 地址


## 🚀 快速开始

### 使用 Docker 运行

1. 构建镜像
```bash
docker build -t tor-proxy-pool .
```

2. 运行容器
```bash
docker run -d \
  --name tor-proxy-pool \
  --restart unless-stopped \
  -p 10086:10086 \
  tor-proxy-pool
```

### 测试代理

```bash
# 查看当前 IP
curl --socks5 127.0.0.1:10086 https://api.ipify.org/?format=json

# 使用 jq 格式化输出
curl --socks5 127.0.0.1:10086 https://api.ipify.org/?format=json | jq '.'
```

## ⚙️ 配置说明

### Tor 配置 (config/torrc)

```plaintext
# Tor SOCKS 端口范围：38801-38810
SOCKSPort 38801
...
SOCKSPort 38810

# 访问控制
SOCKSPolicy accept 127.0.0.1
SOCKSPolicy reject *

# 线路更新设置
NewCircuitPeriod 30        # 每 30 秒建立新的线路
CircuitBuildTimeout 10     # 线路建立超时时间为 10 秒
```

### 代理服务配置

- 默认监听端口：10086
- 代理协议：SOCKS5
- Tor 实例数量：10 个（可在 src/proxy.js 中修改 TOR_PORTS 数组）

## 🔧 高级配置

### 自定义 Tor 实例数量

1. 修改 `config/torrc` 中的 SOCKSPort 配置
2. 更新 `src/proxy.js` 中的 TOR_PORTS 数组
3. 重新构建并运行容器

### 调整线路更新频率

修改 `config/torrc` 中的以下参数：
- `NewCircuitPeriod`：调整自动更换线路的时间间隔
- `CircuitBuildTimeout`：调整线路建立的超时时间

## 📝 注意事项

- 本项目仅供学习和研究使用
- 使用 Tor 网络可能会降低网络访问速度
- 建议在生产环境中增加额外的安全措施

## 🔮 未来计划

- 支持更多协议
  - HTTP 代理
  - HTTPS 代理
- 支持更多配置
  - 支持自定义 Tor 实例数量
  - 支持自定义线路更新频率
  - 支持自定义监听端口

## 📄 许可证

[MIT License](LICENSE)
