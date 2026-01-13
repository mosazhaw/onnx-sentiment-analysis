# docker build -t mosazhaw/onnx-sentiment-analysis .
# docker run --name onnx-sentiment-analysis -p 9000:5000 -d mosazhaw/onnx-sentiment-analysis

FROM python:3.12.10

WORKDIR /usr/src/app

# Install dependencies using uv lockfile into system Python
ENV UV_PROJECT_ENVIRONMENT=/usr/local
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir uv \
    && uv sync --frozen --no-dev

# Copy application files
COPY app app
COPY web web

# Docker Run Command
EXPOSE 5000
WORKDIR /usr/src/app/app
CMD [ "python", "-m" , "flask", "run", "--host=0.0.0.0" ]
