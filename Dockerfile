# Etapa 1: base - instala todas las dependencias (dev + prod) y copia código
FROM node:20-slim AS base
WORKDIR /app
RUN rm -rf .next
COPY package*.json ./
COPY .env .env

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

RUN npm install

COPY . .

# Etapa 2: build - corre el build (compila Next.js)
FROM base AS build
RUN npm run build

# Etapa 3: producción - solo copia build y dependencias de producción
FROM node:20-slim AS production

RUN useradd -m appuser
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/public ./public
COPY --from=build /app/.env .env

USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
