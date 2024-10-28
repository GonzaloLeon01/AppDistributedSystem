export const isNewCheckpointValid = (newCheckpoint) => {
    return !(
        !newCheckpoint ||
        typeof newCheckpoint !== 'object' || 
        !newCheckpoint.lat ||
        !typeof newCheckpoint.lat === 'string' ||
        !newCheckpoint.long ||
        !typeof newCheckpoint.long === 'string' ||
        !newCheckpoint.description ||
        !typeof newCheckpoint.description === 'string'
    );
}