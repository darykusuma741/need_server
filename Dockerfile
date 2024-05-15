FROM node:alpine

# Install dependensi yang diperlukan oleh Puppeteer
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Set environment variable agar Puppeteer dapat berjalan di dalam container Docker
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /need_server
ENV TZ=Asia/Makassar
COPY package*.json ./

RUN npm install

COPY . ./

RUN npx prisma generate

EXPOSE 8802