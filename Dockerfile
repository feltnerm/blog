FROM python:3 AS pelican
RUN pip install pelican
ENTRYPOINT [ "pelican" ]

FROM pelican AS blog
WORKDIR /usr/src/blog
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY Makefile tasks.py pelicanconf.py publishconf.py .
COPY content content
ENTRYPOINT [ "make" ]
