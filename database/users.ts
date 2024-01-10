export async function getAnimalOwnerBySessionToken(
  sessionToken: string | undefined,
) {
  // FIXME: Implement proper authorization
  return (await sessionToken) === 'macca';
}
