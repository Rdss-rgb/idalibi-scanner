#/bin/bash

sed -i 's+let API_BASE_URL.*+let API_BASE_URL = "'$API_BASE_URL'"+g' /usr/share/nginx/html/assets/js/face.js

nginx -g 'daemon off;'