#!/bin/bash
# DevFolio VPS birinchi marta sozlash skripti
# Ishlatish: ssh root@176.101.56.53 'bash -s' < scripts/vps-setup.sh
set -e

echo "=== 1. Tizimni yangilash ==="
apt update && apt upgrade -y

echo "=== 2. Docker o'rnatish ==="
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker
apt install -y docker-compose-plugin

echo "=== 3. Nginx + Certbot o'rnatish ==="
apt install -y nginx certbot python3-certbot-nginx

echo "=== 4. Nginx yoqish ==="
systemctl enable nginx
systemctl start nginx

echo "=== 5. Deploy SSH kaliti yaratish (GitHub Actions uchun) ==="
ssh-keygen -t ed25519 -f /root/.ssh/deploy_key -N "" -q
cat /root/.ssh/deploy_key.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

echo ""
echo "==========================================="
echo "GitHub Secrets ga qo'shish uchun PRIVATE KEY:"
echo "==========================================="
cat /root/.ssh/deploy_key
echo "==========================================="

echo "=== 6. Repo klonlash ==="
mkdir -p /opt/devfolio
# git clone https://github.com/YOUR_USERNAME/devfolio.git /opt/devfolio
# cd /opt/devfolio

echo ""
echo "✅ Asosiy sozlash tugadi!"
echo "Keyingi qadamlar:"
echo "  1. git clone qilib /opt/devfolio ga joylashtiring"
echo "  2. /opt/devfolio/.env faylini yarating"
echo "  3. Nginx config fayllarini yarating (quyidagi ko'rsatmaga qarang)"
echo "  4. DNS recordlarini ahost.uz da sozlang"
echo "  5. certbot --nginx -d devfolio.uz -d www.devfolio.uz -d api.devfolio.uz"
echo "  6. docker compose up -d --build"
