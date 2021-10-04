FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
EXPOSE 8081
RUN yarn schema:sync

CMD ["yarn" "start"]
