# Evento: OrderCreated

Representa la creación exitosa de una orden. Producido por el servicio `Order Service` cuando se recibe una petición POST /orders.

## Productor
- Order Service API

## Consumidores
- Logger interno (queue: orders.created.log)
- Futuros servicios: Facturación, Inventario

## Esquema
Ver `schema.json` en este mismo directorio.

## Motivación
Permite desacoplar la creación de la orden de procesos posteriores (facturación, envío, analytics) usando event-driven architecture.
