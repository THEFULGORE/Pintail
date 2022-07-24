const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const nearPoint = (x, y, x1, y1, name) => {
	return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

export const onLine = (x1, y1, x2, y2, x, y) => {
	const a = { x: x1, y: y1 };
	const b = { x: x2, y: y2 };
	const c = { x, y };
	const offset = distance(a, b) - (distance(a, c) + distance(b, c));
	return Math.abs(offset) < 3 ? 'inside' : null;
};

export const insideCircle = (x1, y1, x2, y2, x, y) => {
	const deltaX = x1 - x2;
	const deltaY = y1 - y2;
	const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;
	const distance = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
	return distance <= radius ? 'inside' : null;
};

export const resizedCoordinates = (clientX, clientY, position, coordinates) => {
	const { x1, x2, y1, y2 } = coordinates;
	switch (position) {
		case 'tl':
		case 'start':
			return { x1: clientX, y1: clientY, x2, y2 };
		case 'tr':
			return { x1, y1: clientY, x2: clientX, y2 };
		case 'bl':
			return { x1: clientX, y1, x2, y2: clientY };
		case 'br':
		case 'end':
			return { x1, y1, x2: clientX, y2: clientY };
		default:
			return null;
	}
};

export const adjustElCoordinates = (element) => {
	const { type, x1, y1, x2, y2 } = element;
	if (type === 'rectangle') {
		const minX = Math.min(x1, x2);
		const maxX = Math.max(x1, x2);
		const minY = Math.min(y1, y2);
		const maxY = Math.max(y1, y2);
		return { x1: minX, y1: minY, x2: maxX, y2: maxY };
	} else {
		if (x1 < x2 || (x1 === x2 && y1 < y2)) {
			return { x1, y1, x2, y2 };
		} else {
			//swap coordinates for right orientation
			return { x1: x2, y1: y2, x2: x1, y2: y1 };
		}
	}
};
