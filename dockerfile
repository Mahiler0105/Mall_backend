FROM node:12

COPY ["package*.json" , "/app/"]

WORKDIR /app 

RUN npm install

COPY ["." , "/app/"]

RUN npm run build

ENV PORT=5000

EXPOSE 5000

CMD [ "npm", "start" ]

    




