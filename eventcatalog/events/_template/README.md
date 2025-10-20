# Evento: <NombreEvento>

Descripción corta en una línea: qué hecho de negocio representa.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| <campo> | <tipo> | Sí/No | ... |

## Productor
- <Servicio / Bounded Context>

## Consumidores actuales
- (lista) — si aún no hay, indicar "N/A".

## Consumidores potenciales
- (ideas futuras)

## Ejemplo de payload
```json
{
  "id": "...",
  "...": "..."
}
```

## Semántica
Frase en pasado describiendo el hecho y qué garantiza (y qué NO garantiza).

## Esquema formal
Referenciar `schema.json` o describir inline. Explicar estrategia de compatibilidad (additive-only, versionado, etc.).

## Versionado
- v1: descripción.
- Reglas para pasar a v2.

## Idempotencia
Cómo deduplicar (id natural, correlación, messageId del broker, etc.).

## Motivación
¿Por qué existe este evento? ¿Qué problema de acoplamiento o latencia resuelve?

## Riesgos y Consideraciones
- Posibles pitfalls.
- Tamaño del mensaje, sensibilidad de datos, orden de entrega.

## Changelog
| Fecha | Versión | Cambio | Notas |
|-------|---------|--------|-------|
| YYYY-MM-DD | v1 | Versión inicial | |
