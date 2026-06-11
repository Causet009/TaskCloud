
import os
from pathlib import Path

import oracledb
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
WALLET_DIR = BASE_DIR / "wallet"

load_dotenv(BASE_DIR / ".env")


def obtener_variable(nombre):
    valor = os.getenv(nombre)

    if not valor:
        raise ValueError(
            f"Falta configurar la variable {nombre} en el archivo .env"
        )

    return valor


def probar_conexion():
    conexion = None

    try:
        conexion = oracledb.connect(
            user=obtener_variable("ORACLE_USER"),
            password=obtener_variable("ORACLE_PASSWORD"),
            dsn=obtener_variable("ORACLE_DSN"),
            config_dir=str(WALLET_DIR),
            wallet_location=str(WALLET_DIR),
            wallet_password=obtener_variable(
                "ORACLE_WALLET_PASSWORD"
            ),
        )

        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    USER,
                    SYS_CONTEXT('USERENV', 'DB_NAME'),
                    CURRENT_TIMESTAMP
                FROM dual
                """
            )

            usuario, base_datos, fecha = cursor.fetchone()

        print("Conexión exitosa con Oracle")
        print(f"Usuario conectado: {usuario}")
        print(f"Base de datos: {base_datos}")
        print(f"Fecha de Oracle: {fecha}")

    except Exception as error:
        print("No fue posible conectar con Oracle")
        print(f"Error: {error}")

    finally:
        if conexion is not None:
            conexion.close()
            print("Conexión cerrada correctamente")


if __name__ == "__main__":
    probar_conexion()
