export const nestedInclude = (arr: any[][], item: any): Boolean => {
	let includes = false;
	arr.forEach((nestedArr) => {
		nestedArr.forEach((arrItem) => {
			if (item === arrItem) {
				includes = true;
			}
		});
	});
	return includes;
};

export const nestedLength = (arr: any[][]): Number => {
	let length = 0;
	arr.forEach((nestedArr) => {
		length += nestedArr.length;
	});

	return length;
};
