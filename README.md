# 构建
```bash
docker build -t tor-proxy-pool .
```

# 运行

- 默认配置
```bash
docker run -d \
  --name tor-proxy-pool \
  --restart unless-stopped \
  -p 10086:10086 \
  tor-proxy-pool
```
