FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build
RUN npm prune --production
EXPOSE 3000
CMD ["npm", "start"]
