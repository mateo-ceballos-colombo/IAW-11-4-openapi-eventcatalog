# Evento: OrderCreated

Representa la creación exitosa de una orden. Producido por el servicio `Order Service` al procesar `POST /orders`.

| Campo        | Tipo        | Obligatorio | Descripción |
|--------------|-------------|-------------|-------------|
| id           | string      | Sí          | Identificador único de la orden |
| customerName | string      | Sí          | Nombre del cliente |
| items        | Item[]      | Sí          | Ítems de la orden |
| total        | number      | Sí          | Suma calculada de (quantity * price) |
| createdAt    | string(ISO) | Sí          | Timestamp de creación |
| status       | string      | Sí          | Estado inicial (CREATED) |

`Item`:
| Campo    | Tipo   | Obligatorio | Descripción |
|----------|--------|-------------|-------------|
| sku      | string | Sí          | Código del producto |
| quantity | number | Sí          | Cantidad solicitada |
| price    | number | Sí          | Precio unitario |

## Productor
- Order Service API (bounded context: Orders)

## Consumidores actuales
- Logger interno (queue: `orders.created.log`)

## Consumidores potenciales
- Facturación, Inventario, Notificaciones, Analytics

## Ejemplo de payload
```json
{
	"id": "68f6412b11e09e3e143d4f49",
	"customerName": "Alice",
	"items": [{ "sku": "A1", "quantity": 2, "price": 10 }],
	"total": 20,
	"createdAt": "2025-10-20T14:03:23.686Z",
	"status": "CREATED",
	"schemaVersion": "1.0"
}
```

**Nota sobre `schemaVersion`**: Campo opcional que permite identificar la versión del esquema del evento. Los consumidores pueden usar este campo para aplicar lógica de migración o compatibilidad cuando se introduzcan cambios. Si no está presente, se asume `v1.0`.

## Semántica
Indica un hecho ya ocurrido (evento en pasado). No garantiza procesos posteriores (facturación, inventario), sólo que la orden fue persistida.

## Esquema formal
Ver `schema.json` (alineado a OpenAPI `Order` schema). Mantener compatibilidad: agregar campos nuevos como opcionales.

## Versionado
- Versión inicial: `v1` (campo `schemaVersion` opcional; se asume v1.0 si no está presente).
- **Regla de compatibilidad**: Política **additive-only** para v1 — nuevos campos deben ser opcionales para no romper consumidores existentes.
- Cambios incompatibles futuros => crear `OrderCreatedV2` o incluir campo `schemaVersion` explícito con lógica de migración en consumidores.

## Idempotencia
El identificador `id` permite a consumidores deduplicar si llegan mensajes repetidos.

## Motivación
Desacoplar la creación de órdenes de procesos posteriores (facturación, envío, analytics) mediante arquitectura orientada a eventos.

## Riesgos y Consideraciones
- Payload grande (muchos ítems) puede impactar throughput: considerar publicar sólo campos esenciales + correlación.
- Evitar filtrado lógico en consumidores basado en campos que podrían cambiar (usar hechos inmutables).

## Relación con otros eventos
- **Ver también**: [OrderCancelled](../OrderCancelled/README.md) - Evento de cancelación de orden (puede seguir a OrderCreated).

## Changelog
| Fecha | Versión | Cambio | Notas |
|-------|---------|--------|-------|
| 2025-10-20 | v1 | Versión inicial | Definición base |
