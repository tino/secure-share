FROM python:3.6-alpine

RUN apk add --update \
    python3-dev \
    build-base \
    gcc \
    libev libev-dev \
    linux-headers && \
    rm -rf /var/cache/apk/*

RUN pip install bjoern

WORKDIR /usr/src/app/

COPY requirements.txt /usr/src/app/
RUN pip install -r requirements.txt

COPY ./ /usr/src/app/

EXPOSE 8000
CMD [ "python", "run_app.py" ]
