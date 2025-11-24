FROM node:23

WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./
RUN apt-get update && apt-get install -y ffmpeg which

# ติดตั้ง dependencies (รวม prisma client, nodemon, ts-node ด้วย)
RUN npm install


# คัดลอกโค้ดทั้งหมด
COPY . .

# รันคำสั่ง generate Prisma Client (ทุกครั้งที่ container start)
RUN npx prisma generate


# expose port ที่แอปรัน (เช่น 3000)
EXPOSE 3030

# รันแอปด้วย nodemon ผ่าน npx
CMD ["npm", "run", "dev"]
# ========================
# Stage 1: Build Stage
# ========================
FROM node:23-alpine AS build-stage

WORKDIR /app

# ติดตั้ง dependencies สำหรับ build (เช่น ffmpeg)
RUN apk add --no-cache ffmpeg bash

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci

# คัดลอก source code
COPY . .

# สร้าง Prisma Client
RUN npx prisma generate

# ========================
# Stage 2: Production Stage
# ========================
FROM node:23-alpine AS production-stage

WORKDIR /app

# ติดตั้ง runtime dependencies (ไม่รวม devDependencies)
COPY package*.json tsconfig.json ./
RUN npm ci --omit=dev

# คัดลอก build output จาก stage แรก
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/prisma ./prisma
COPY --from=build-stage /app/src ./src

# ติดตั้ง ffmpeg runtime
RUN apk add --no-cache ffmpeg bash

EXPOSE 3030

# รันแอป
CMD ["npm", "run", "dev"]
