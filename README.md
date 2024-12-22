# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## El uso de angular con base de datos en Oracle

El frontend teniendo un backend centrado en Oracle (usando Adonis como intermediario) es simple su uso, no requiere mucha ciencia, se comporta como cualquier frontend con cualquier base de datos, solo que tiene unas leves diferencias, sobretodo en el llamado de los procedimientos y el uso de estos

##Tener en cuenta 

Los triggers no es necesario llamarlos o tratarlos obvaimente, no es necesario explicar el porque, en caso de usar funciones recordar que tambien se debe tratar la respuesta ademas de la peticion, no implica mucha complejidad, pero se debe revisar bien para atrapar la respuesta apropiada

##Epayco

El uso de Epayco como Pasarla de pagos se debe a la facilidad que permitia esta para la creacion de pagos, facturas y el modo testeo, en este caso los pagos tenian que ser dinamicos, en pocas palabras, el valor y descripcion no eran siempre los mismos, por lo cual se atrapo las respuestas elegidas en cuantoa  transacciones, una vez que el pago es procesado el estado de la transacción cambiara dependiendo del estado del pago por epayco, para este caso lo unico que hay que hacer es en el environments.ts es crear una variable llamada epayco "epayco_public_key", reemplazar por la clave publica del epayco, no hay que hacer nada mas, ahora en caso de la respuesta de epayco, esta se tiene que configurar, poniendo el link_del_backend/api/webhook/epayco, ya el backend se encarga de procesar esta respuesta y transformar la transacción en una aceptada, rechazada, pendiente, etc, recordar que aunque quede la respuesta en pendiente por pagar por efecty por ejemplo, una vez se realice el pago el epayco actualizara el estado y se actualizara la transacción

##Seguridad

Todo lo que tiene que ver con el login, registro del usuario (osea el guardado de contraseña) se realiza en otra base de datos, esto para implementar mayor robustes y seguridad dividiendo los datos y encriptandolos en otra base de datos NO RELACIONA y realizada en springBOOT y Mongo, No sera compartido este microservicio, debido a que la filtracion de esta logica podria ser fatal para siguientes proyectos que voy a realizar, si se quiere se puede eliminar el uso de otra base de datos y guardar toda la informacion en ORACLE, pero se tiene que tener en cuenta que se tiene que reconfigurar las rutas en los services "securityServices", "RegisterServices" y "LoginServices", aparte se tiene que realizar forma de encriptacion y asegurarse de que la creacion de los usuariso AHORA POR ORACLE retornen un token que sea capaz de ser desencriptado, en caso de no realizarlo, investigar como crear un proyecto en Mongo con spring y crear beare tokens, no implica mucha dificultad y la preparacion y entendimiento del codigo puede resultar en un potente entendimiento para todo lo que tiene que ver con logica de seguridad y crear robustez en las bases de datos,s obretodo en las contraseñas de usuarios

##Transacciones

Debido al poco tiempo, se planteo de una forma no muy apropiada y que puede llegar a crear informacion redundante, esto se puede solucionar de distintas formas
    
    1. Actualizar la forma para que simplemente se elijan las opciones realiadas, mas no crear una transaccion
    2. crear una transaccion unaicamente cuando el pago sea realizado (no recomendable)
    3. borrado periodico de una transacción pasados 3 dias,a la vez, poner en epayco que ese sea el limite para el pago
Otra cosa a tener en cuenta en cuanto a transacciónes, debido a que su creacion depende de un procedimiento, no se puede atrapar el id de respuesta, osea el id de la transaccion recien creada, algo que proceduce muchos errores en cuanto a la respuesta de epayco, su forma de solucion simplemente consta en modificar el procedimiento y crearle una salida, cambiando tambien en el backend la forma en la que se procesa el controllador del procedimiento de creaciond e transaccion, no lo hago yo debido a que abandono este proyecto por el momento, razon por la cual la presentación en frontend es muy probre

##Ultimas notas

El proyecto carece de algo muy importante, que es la capacidad de listar las apuestas (para administrador) y listar las apuestas que realizo un cliente, algo muy importante y tracendental, aparte agregar un apartado de notificaciones en caso de que gane alguna apuesta

Una cosa mas, en caso de querer filtrar paginas e informacion
usar el 
canActivate:[AuthGuard] 
y poner para el path
path: 'admin-nombre_apartado_pagina', component: tuComponent,

