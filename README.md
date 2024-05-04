# Ejemplos de llamada
## Seteo de ranking concreto a userId concreto
http://{host}:{port}/user/{UserID}/rank/{RankID}

Ejemplo:
http://localhost:8080/user/12345678/rank/2

## Seteo de ranking concreto a una lista de usersIds separados por comas
http://{host}:{port}/users/{ListaUserIDsSeparadosPorComas}/rank/{RankID}

Ejemplo:
http://localhost:8080/users/12345678,23456789,34567890/rank/2

## Ayuda
http://{host}:{port}/

Ejemplo:
http://localhost:8080/


# Comando para arrancar el programa
npm start