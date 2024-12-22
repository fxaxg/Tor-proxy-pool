# [中文](README_CN.md) | [English](README.md)

# Tor Proxy Pool Service 🌐

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](Dockerfile)

A proxy pool service based on the Tor network that rotates IP addresses from multiple Tor instances to provide a stable proxy service.

## ✨ Features

- 🔄 Automatic rotation of multiple Tor instances (10 by default)
- 🔒 SOCKS5 proxy protocol support
- 🚀 Simple Docker deployment
- ⚡ Automatic IP address switching

## 🚀 Quick Start

### Run with Docker

1. Build the image
```bash
docker build -t tor-proxy-pool .
```

2. Run the container
```bash
docker run -d \
  --name tor-proxy-pool \
  --restart unless-stopped \
  -p 10086:10086 \
  tor-proxy-pool
```

### Test the Proxy

```bash
# Check current IP
curl --socks5 127.0.0.1:10086 https://api.ipify.org/?format=json

# Format output with jq
curl --socks5 127.0.0.1:10086 https://api.ipify.org/?format=json | jq '.'
```

## ⚙️ Configuration

### Tor Configuration (config/torrc)

```plaintext
# Tor SOCKS port range: 38801-38810
SOCKSPort 38801
...
SOCKSPort 38810

# Access Control
SOCKSPolicy accept 127.0.0.1
SOCKSPolicy reject *

# Circuit Update Settings
NewCircuitPeriod 30        # Create new circuit every 30 seconds
CircuitBuildTimeout 10     # Circuit build timeout is 10 seconds
```

### Proxy Service Configuration

- Default listening port: 10086
- Proxy protocol: SOCKS5
- Number of Tor instances: 10 (can be modified in src/proxy.js by updating TOR_PORTS array)

## 🔧 Advanced Configuration

### Customize Number of Tor Instances

1. Modify SOCKSPort configuration in `config/torrc`
2. Update TOR_PORTS array in `src/proxy.js`
3. Rebuild and run the container

### Adjust Circuit Update Frequency

Modify the following parameters in `config/torrc`:
- `NewCircuitPeriod`: Adjust the interval for automatic circuit switching
- `CircuitBuildTimeout`: Adjust the timeout for circuit establishment

## 📝 Notes

- This project is for learning and research purposes only
- Using the Tor network may result in slower network access
- Additional security measures are recommended for production environments

## 🔮 Future Plans

- Support for more protocols
  - HTTP proxy
  - HTTPS proxy
- Support for more configurations
  - Custom number of Tor instances
  - Custom circuit update frequency
  - Custom listening port

## 📄 License

[MIT License](LICENSE)