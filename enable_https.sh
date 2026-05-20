#!/bin/bash

# 云服务器配置
HOST="159.75.174.231"
USER="ubuntu"
PASSWORD="QWER12345@"
DOMAIN="jok.bot.cd"
EMAIL="admin@jok.bot.cd"  # 替换为你的邮箱

# 安装 sshpass 如果不存在
if ! command -v sshpass &> /dev/null; then
    echo "安装 sshpass..."
    sudo apt update && sudo apt install -y sshpass
fi

echo "为 $DOMAIN 安装 Let's Encrypt SSL 证书..."

sshpass -p "$PASSWORD" ssh $USER@$HOST << 'EOF'
# 安装 Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d jok.bot.cd -d www.jok.bot.cd --non-interactive --agree-tos -m $EMAIL

# 设置自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo "HTTPS 配置完成！"
echo "访问 https://$DOMAIN"
EOF
