FROM node:18

WORKDIR /app

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  golang \
  default-jdk \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY .env .env
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 7000

CMD ["node", "Index.js"]
