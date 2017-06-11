/**
 * Converts value based on factor. If value not provided returns empty string
 * @param {string} from
 * @param {number} factor
 * @returns {string}
 */
export default function convertValue(from, factor) {
    const preparedValue = Number(from);

    if (!preparedValue) {
        return '';
    }

    return (preparedValue * factor).toString();
}