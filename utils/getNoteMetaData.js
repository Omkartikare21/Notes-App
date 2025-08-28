export async function getNoteMetadata(mode) {
  return {
    title: `Notes App | ${mode} ${ mode === 'HOME' ? '' : 'Note'}`,
  };
}
