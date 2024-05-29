export function findAndCountDuplicates(arr) {
    let counts = {};

    // Подсчитываем количество повторений каждого подмассива
    arr.forEach(subArr => {
        let key = JSON.stringify(subArr.slice().sort()); // Сортируем элементы подмассива для единообразия
        counts[key] = (counts[key] || 0) + 1;
    });

    // Создаем новый массив, содержащий уникальные подмассивы с добавленным количеством повторений
    let result = [];
    arr.forEach(subArr => {
        let key = JSON.stringify(subArr.slice().sort());
        let count = counts[key];
        delete counts[key]; // Удаляем счетчик, чтобы избежать повторного добавления
        if (count !== undefined) {
            result.push(subArr.concat(count));
        }
    });

    return result;
}

export function isLessThanAny(number, array) {
    return array.some((element) => number < element);
}
export function hasZeros(array) {
    return array.includes(0);
}

export function hasZeroIn(array){
    return array.includes('');
}

export function transformArray(inputArray) {
    return inputArray.map((item, index) => ({
        id: index + 1,
        name: "Row " + (index + 1),
        cuts: item[0].toString(),
        counts: item[1].toString()
    }));
}