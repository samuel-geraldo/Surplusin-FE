from node:22-alpine as builder
workdir /app
copy package*.json ./
run npm ci
copy . .
run npm run build
from nginx:stable-alpine as runner
copy --from=builder /app/dist /usr/share/nginx/html
copy nginx.conf /etc/nginx/conf.d/default.conf
expose 80
