// returns array of specifie length of numbers starting from 0
const range = (length) => [...Array(length).keys()];

const isEmptyObject = obj => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}