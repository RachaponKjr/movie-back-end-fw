FROM node:23

WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (ถ้ามี)
COPY package*.json ./

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
