cd /rvendas
git pull
if [ $(wc -l <cron-log) -gt 1 ]; then
  echo "Deploying..."
  pm2 restart 0
else
  echo "No changes to deploy."
fi
