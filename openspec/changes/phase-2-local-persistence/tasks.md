## 1. Modelo y utilidades de fecha

- [ ] 1.1 Evolucionar `src/types/habit.ts` (`completedDates`, `createdOn`, `pausedPeriods`; eliminar `completedToday`) y verificar con `npm run check`
- [ ] 1.2 Crear la utilidad `todayKey()` de fecha local en `src/data/` y verificar que nunca usa UTC/`toISOString`
- [ ] 1.3 Migrar `src/data/habits.mock.ts` al nuevo modelo y verificar con `npm run check`

## 2. Cálculos puros (racha y consistencia)

- [ ] 2.1 Implementar `scheduledWeekdays` (normaliza `weekdays` a [1,2,3,4,5]) y verificar los 3 tipos de frecuencia
- [ ] 2.2 Implementar `currentStreak` (ocasiones programadas, hoy pendiente no rompe, pausa como muro) y verificar los casos L–X–V, diario y pausado del diseño
- [ ] 2.3 Implementar `consistency7d` (excluye pre-`createdOn`, no-programados y pausas; sin-dato si denominador 0) y verificar el caso de hábito nuevo a mitad de ventana

## 3. Store único con persistencia local

- [ ] 3.1 Crear el store en `src/data/` con firma async (`list/toggle/create/update/remove/setStatus`), persistencia en `localStorage` bajo clave versionada y siembra única desde el mock; verificar recarga conserva estado
- [ ] 3.2 Migrar `DashboardIsland` al store (eliminar su `useState` local) y verificar completar/deshacer actualiza progreso y orden
- [ ] 3.3 Migrar `HabitsIsland` al store (crear/editar/eliminar/pausar) y verificar que los cambios se reflejan en `/app` tras navegar

## 4. Estadísticas reales en la UI

- [ ] 4.1 Conectar `DailyProgress` y `WeeklySummary` a racha/consistencia reales y verificar que desaparecen los valores fijos (82%, 6 días)
- [ ] 4.2 Conectar `ProgressSummary` a datos reales (consistencia, rachas, últimos 14 días, fuertes/débiles) manteniendo el estado sin-dato, y verificar `/app/progress` sigue sin `client:*`

## 5. Cierre y validación Fase 2

- [ ] 5.1 Ejecutar `npm run check`, `npm run lint` y `npm run build` y verificar los tres en verde
- [ ] 5.2 Validar las 6 rutas con status 200 en dev temporal y verificar crear→navegar→recargar conserva todo el estado
- [ ] 5.3 Actualizar README (limitaciones y próximos pasos) y verificar que la limitación de recálculo con programa actual queda documentada
