FROM python:latest

ENV PYTHONUNBUFFERED 1

WORKDIR /app/api
COPY requirements.txt ./
RUN pip install -r requirements.txt --default-timeout=100
RUN pip install gunicorn
RUN pip install daphne

COPY . ./

EXPOSE 8000
