from alpine:3.14
label meatup=
workdir /app
expose 80
copy package.json /app
run apk add --no-cache nodejs npm \
        && npm install --prod
cmd ["npm", "start"]
copy . /app
