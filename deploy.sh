#!/bin/bash

# 云服务器配置
HOST="159.75.174.231"
USER="ubuntu"
PASSWORD="QWER12345@"
DOMAIN="jok.bot.cd"
SITE_DIR="/var/www/jok-bot-cd"

# 安装 sshpass 如果不存在
if ! command -v sshpass &> /dev/null; then
    echo "安装 sshpass..."
    sudo apt update && sudo apt install -y sshpass
fi

# 1. 安装 Nginx
echo "1. 连接服务器并安装 Nginx..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$HOST "sudo apt update && sudo apt install -y nginx"

# 2. 创建网站目录
echo "2. 创建网站目录..."
sshpass -p "$PASSWORD" ssh $USER@$HOST "sudo mkdir -p $SITE_DIR && sudo chown -R $USER:$USER $SITE_DIR"

# 3. 上传网站文件
echo "3. 上传网站文件..."
sshpass -p "$PASSWORD" scp -o StrictHostKeyChecking=no index.html style.css script.js CNAME $USER@$HOST:$SITE_DIR/
sshpass -p "$PASSWORD" ssh $USER@$HOST "mkdir -p $SITE_DIR/assets/trash"
sshpass -p "$PASSWORD" scp -r -o StrictHostKeyChecking=no assets/* $USER@$HOST:$SITE_DIR/assets/

# 4. 配置 Nginx
echo "4. 配置 Nginx..."
sshpass -p "$PASSWORD" ssh $USER@$HOST << 'EOF'
sudo tee /etc/nginx/sites-available/jok-bot-cd > /dev/null << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name jok.bot.cd www.jok.bot.cd;

    root /var/www/jok-bot-cd;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(js|css|png|svg|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }
}
NGINX

# 启用站点
sudo ln -sf /etc/nginx/sites-available/jok-bot-cd /etc/nginx/sites-enabled/

# 禁用默认站点（如果有）
sudo rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
EOF

# 5. 设置文件权限
echo "5. 设置文件权限..."
sshpass -p "$PASSWORD" ssh $USER@$HOST "sudo chown -R www-data:www-data $SITE_DIR && sudo chmod -R 755 $SITE_DIR"

# 6. 获取服务器 IP
echo ""
echo "========================================"
echo "部署完成！"
echo "========================================"
echo "网站将在以下地址访问："
echo "  - http://jok.bot.cd"
echo "  - http://$HOST"
echo ""
echo "下一步操作："
echo "1. 请在域名服务商处添加 DNS 记录："
echo "   - 类型: A"
echo "   - 名称: @ (或 jok)"
echo "   - 值: $HOST"
echo ""
echo "2. 等待 DNS 生效（通常 5-30 分钟）"
echo ""
echo "3. 如需启用 HTTPS（可选但推荐），运行："
echo "   ./enable_https.sh"
