FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

##RUN docker --network=host

#RUN docker run -d --restart always kostux/server
#RUN docker restart $(docker ps -a -q)

#EXPOSE 57070:57070

#EXPOSE 80/tcp
#EXPOSE 80/udp

CMD [ "node", "server.js" ]