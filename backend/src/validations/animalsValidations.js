export const isNewAnimalValid = (newAnimal) => {
    return !(
        !newAnimal ||
        typeof newAnimal !== 'object' ||
        !newAnimal.name ||
        !typeof newAnimal.name === 'string' ||
        !newAnimal.description ||
        !typeof newAnimal.description === 'string'
    );
}