FROM nginx

COPY entrypoint.sh /bin/entrypoint.sh
COPY . /usr/share/nginx/html

CMD ["/bin/entrypoint.sh"]