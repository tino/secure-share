# Two stage build with the frontend files first
FROM node:10-alpine as frontend
COPY ./frontend /frontend
RUN cd /frontend && \
    yarn install && \
    yarn dist

# Seconds stage for the backend
FROM python:3.6-alpine
COPY --from=frontend /frontend /usr/src/frontend
ENV STATIC_DIR=/usr/src/frontend/dist

RUN apk add --update \
    python3-dev \
    build-base \
    gcc \
    libev libev-dev \
    linux-headers && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/src/app/

COPY requirements.txt /usr/src/app/
RUN pip install -r requirements.txt

COPY ./ /usr/src/app/

EXPOSE 8000
CMD [ "python", "app.py" ]
