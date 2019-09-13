FROM nginx:1.17.1-alpine

WORKDIR /usr/share/nginx/html

COPY ./contents .
COPY settings.js ./build/

CMD ["nginx", "-g", "daemon off;"]
