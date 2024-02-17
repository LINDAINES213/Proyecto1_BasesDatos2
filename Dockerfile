# Utiliza una imagen base de Python 3.11.4
FROM python:3.11.4

# Establece el directorio de trabajo en /app
WORKDIR /app

# Crea un directorio dentro de la imagen para copiar los archivos
RUN mkdir /app

# Copia el archivo de requisitos (requirements.txt) al directorio en la imagen
COPY requirements.txt /app

# Instala las dependencias del proyecto
RUN pip install -r /app/requirements.txt

# Copia todo el contenido del directorio actual al directorio de trabajo en la imagen
COPY . /app                                                                                                                                                                0.6s
RUN sed -i '/from werkzeug.urls import url_decode/d' /app/venv/Lib/site-packages/flask_login/utils.py                                                                    0.4s
RUN sed -i '/from werkzeug.urls import url_encode/d' /app/venv/Lib/site-packages/flask_login/utils.py                                                                    0.5s
RUN sed -i '/from werkzeug.urls import url_decode/d' /usr/local/lib/python3.11/site-packages/flask_login/utils.py                                                        0.7s
RUN sed -i '/from werkzeug.urls import url_encode/d' /usr/local/lib/python3.11/site-packages/flask_login/utils.py