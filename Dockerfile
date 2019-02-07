FROM node:8-alpine

EXPOSE 8080
ENV APP_ROOT=/opt/app-root/src
ENV HOME=/opt/app-root/src
ARG NODE_ENV=development

RUN mkdir -p ${APP_ROOT} && \
    apk update && apk upgrade && \
    apk add --no-cache git openssh

ADD . ${APP_ROOT}

WORKDIR ${APP_ROOT}

RUN mv ${APP_ROOT}/.ssh /root/.ssh && \
    NODE_ENV=${NODE_ENV} npm install && \
    rm -rf /root/.ssh

RUN chown -R 1001:0 ${APP_ROOT} && chmod -R ug+rwx ${APP_ROOT}

# lifted centos/nodejs s2i builder fix_permissions script
RUN find -L "${APP_ROOT}" -user 1001 \! -group 0 -exec chgrp 0 {} + && \
    find -L "${APP_ROOT}" -user 1001 \! -perm -g+rw -exec chmod g+rw {} + && \
    find -L "${APP_ROOT}" -user 1001 -perm /u+x -a \! -perm /g+x -exec chmod g+x {} + && \
    find -L "${APP_ROOT}" -user 1001 -type d \! -perm /g+x -exec chmod g+x {} +

USER 1001
CMD npm run start
