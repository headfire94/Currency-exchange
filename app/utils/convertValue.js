export default function convertValue(from, factor) {
    const preparedValue = Number(from);

    if (!preparedValue) {
        return '';
    }

    return (preparedValue * factor).toString();
}