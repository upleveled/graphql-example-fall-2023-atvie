export function postgresToGraphql<Entity extends { id: number } | undefined>(
  entity: Entity,
) {
  if (!entity) return null;

  return {
    ...entity,
    id: String(entity.id),
  };
}
