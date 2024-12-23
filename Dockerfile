FROM node:20-alpine

WORKDIR /var/www

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
