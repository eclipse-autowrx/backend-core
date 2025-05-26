FROM kong:3.7.1-ubuntu

COPY kong.yml /etc/kong/kong.yml
COPY ./custom-auth /usr/local/share/lua/5.1/kong/plugins/custom-auth

ENV KONG_DATABASE=off \
  KONG_DECLARATIVE_CONFIG=/etc/kong/kong.yml \
  KONG_PLUGINS=bundled,custom-auth

