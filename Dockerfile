# Usar la imagen oficial de Python
FROM python::3.11

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo de requisitos (requirements.txt) al directorio de trabajo
COPY requirements.txt .

# Instalar las dependencias del proyecto
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación al directorio de trabajo
COPY . .

# Exponer el puerto 5000 (o el puerto en el que tu aplicación Flask esté escuchando)
EXPOSE 5000

# Comando para ejecutar la aplicación Flask cuando se inicie el contenedor
CMD ["python", "app.py"]
