FROM wordpress:cli

# Install make tool
# USER root
# RUN apk add --no-cache make

# Make docker-compose wait for container dependencies be ready
# Add the wait script to the image
# ENV WAIT_VERSION 2.7.2
# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
# RUN chmod +x /wait
RUN wp core download --version={{WORDPRESS_VERSION}}

USER 33:33
CMD ["wp", "shell"]