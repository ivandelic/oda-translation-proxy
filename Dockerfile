FROM node:12
WORKDIR /proxy
COPY . ./
RUN npm install
CMD [ "npm", "start" ]