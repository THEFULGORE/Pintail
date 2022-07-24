import { getSvgPathFromStroke } from './strokeGenerator';
import getStroke from 'perfect-freehand';
import { onLine, nearPoint, insideCircle } from './coordsCalc';
import { generator } from './strokeGenerator';

export const createElement = (id, x1, y1, x2, y2, type, style) => {
	const { strokeColor, fillStyle, pattern, roughness, strokeWidth, bowing } = style;
	let roughElement = null;
	switch (type) {
		case 'line':
			roughElement = generator.line(x1, y1, x2, y2, {
				stroke: strokeColor,
				strokeWidth,
				roughness,
			});
			return { id, x1, y1, x2, y2, type, roughElement };
		case 'rectangle':
			roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
				stroke: strokeColor,
				fill: fillStyle,
				fillStyle: pattern,
				strokeWidth,
				bowing,
				roughness,
			});
			return { id, x1, y1, x2, y2, type, roughElement };
		case 'circle':
			const deltaX = x1 - x2;
			const deltaY = y1 - y2;
			const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
			roughElement = generator.circle(x1, y1, radius, {
				stroke: strokeColor,
				fill: fillStyle,
				fillStyle: pattern,
				strokeWidth,
				bowing,
				roughness,
			});
			return { id, x1, y1, x2, y2, type, roughElement };
		case 'pencil':
			const color = style.strokeColor;
			return { id, type, points: [{ x: x1, y: y1 }], color, strokeWidth };
		case 'text':
			const textColor = style.strokeColor;
			return { id, type, x1, y1, x2, y2, text: '', textColor };
		default:
			throw new Error(`Type not recognised: ${type}`);
	}
};

export const drawElement = (roughCanvas, context, element) => {
	switch (element.type) {
		case 'line':
		case 'rectangle':
		case 'circle':
			roughCanvas.draw(element.roughElement);
			break;
		case 'pencil':
			const stroke = getStroke(element.points, {
				size: element.strokeWidth,
				thinning: 0.5,
				smoothing: 0.5,
				streamline: 0.5,
			});
			//context.save();
			context.fillStyle = element.color;
			const outlinePoints = getSvgPathFromStroke(stroke);
			const svgPath = new Path2D(outlinePoints);
			//context.fillStyle = element.color;
			context.fill(svgPath);
			//context.restore();
			break;
		case 'text':
			context.textBaseline = 'top';
			context.font = '24px serif';
			context.fillStyle = element.textColor;
			context.fillText(element.text, element.x1, element.y1);
			break;
		default:
			throw new Error(`Type not recognised: ${element.type}`);
	}
};

const positionWithinEl = (x, y, element) => {
	const { type, x1, x2, y1, y2 } = element;

	switch (type) {
		case 'line':
			const on = onLine(x1, y1, x2, y2, x, y);
			const start = nearPoint(x, y, x1, y1, 'start');
			const end = nearPoint(x, y, x2, y2, 'end');
			return start || end || on;
		case 'rectangle':
			const topLeft = nearPoint(x, y, x1, y1, 'tl');
			const topRight = nearPoint(x, y, x2, y1, 'tr');
			const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
			const bottomRight = nearPoint(x, y, x2, y2, 'br');
			const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
			return topLeft || topRight || bottomLeft || bottomRight || inside;
		case 'circle':
			return insideCircle(x1, y1, x2, y2, x, y);
		case 'pencil':
			const betweenAnyPoint = element.points.some((point, index) => {
				const nextPoint = element.points[index + 1];
				if (!nextPoint) return false;
				return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y) != null;
			});
			return betweenAnyPoint ? 'inside' : null;
		case 'text':
			return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
		default:
			throw new Error(`Type not recognised: ${type}`);
	}
};

export const getElementAtPosition = (x, y, elements) => {
	return elements
		.map((el) => ({ ...el, position: positionWithinEl(x, y, el) }))
		.find((el) => el.position !== null);
};
