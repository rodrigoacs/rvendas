cd ./rvendas
git pull >git.log
if [ $(wc -l <git.log) -gt 1 ]; then
  echo "Deploying..."
  npm run build
  pm2 restart 0
else
  echo "No changes to deploy."
fi
