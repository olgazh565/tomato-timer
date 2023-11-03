// добавляем 0 к одиночным цифрам
export const addZero = num => `0${num}`.slice(-2);

// универсальное создание элементов
export const createElement = (tagName, attribute) => {
	const elem = document.createElement(tagName);
	Object.assign(elem, attribute);

	return elem;
};

// склонение слов
export const declOfNum = (num, words) => words[
	(num % 100 > 4 && num % 100 < 20) ? 2 :
			[2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]
];

