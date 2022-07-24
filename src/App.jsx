import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.scss';
import rough from 'roughjs/bundled/rough.esm';
import { useHistory } from './hooks/history';
import { resizedCoordinates, adjustElCoordinates } from './utils/coordsCalc';
import { adjustmentRequired } from './utils/adjustmentReq';
import { drawElement, createElement, getElementAtPosition } from './utils/elements';
import { cursorForPosition } from './utils/cursorStyle';
import { types, styleClasses, initialStyle } from './utils/consts';
import { Button } from './components/Button';
import { saveCanvas } from './utils/saveCanvas';
import { SideOptions } from './components/SideOptions';
import { useStyle } from './hooks/useStyle';

function App() {
	const textAreaRef = useRef();
	const [elements, setElements, undo, redo, clearHistory] = useHistory([]);
	const [action, setAction] = useState('none');
	const [backroundcolor, setBackroundcolor] = useState('#ffffff');
	const [style, setStyle] = useStyle(initialStyle);
	const [tool, setTool] = useState('selection');
	const [selectedEl, setSelectedEl] = useState(null);
	const [hide, setHide] = useState(true);

	useLayoutEffect(() => {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const roughCanvas = rough.canvas(canvas);
		ctx.fillStyle = backroundcolor;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		elements.forEach((element) => {
			if (action === 'writing' && selectedEl.id === element.id) return;
			drawElement(roughCanvas, ctx, element);
		});
	}, [elements, action, selectedEl, backroundcolor]);

	useEffect(() => {
		const undoRedoFunction = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
				if (event.altKey) {
					redo();
				} else {
					undo();
				}
			}
		};
		document.addEventListener('keydown', undoRedoFunction);
		return () => {
			document.removeEventListener('keydown', undoRedoFunction);
		};
	}, [undo, redo]);

	useEffect(() => {
		const textArea = textAreaRef.current;
		if (action === 'writing') {
			setTimeout(() => {
				textArea.focus();
			}, 0);
			textArea.textContent = selectedEl.text;
		}
	}, [action, selectedEl]);

	const setType = useCallback((type) => {
		setTool(type);
	}, []);

	const memoizedSetStyle = useCallback((type, value) => {
		setStyle(type, value);
	}, []);

	const memoizedSave = useCallback(() => saveCanvas(), []);

	const updateElement = (id, x1, y1, x2, y2, type, options) => {
		const elementsCopy = [...elements];

		switch (type) {
			case 'line':
			case 'rectangle':
			case 'circle':
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, style);
				break;
			case 'pencil':
				elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
				break;
			case 'text':
				const textWidth = document
					.getElementById('canvas')
					.getContext('2d')
					.measureText(options.text).width;
				const textHeight = 24;
				elementsCopy[id] = {
					...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, style),
					text: options.text,
				};
				break;
			default:
				throw new Error(`Type not recognised: ${type}`);
		}

		setElements(elementsCopy, true);
	};

	const handleMouseDown = (e) => {
		if (action === 'writing') return;
		const { clientX, clientY } = e;
		if (tool === 'selection') {
			const element = getElementAtPosition(clientX, clientY, elements);
			if (element) {
				if (element.type === 'pencil') {
					const xOffsets = element.points.map((point) => clientX - point.x);
					const yOffsets = element.points.map((point) => clientY - point.y);
					setSelectedEl({ ...element, xOffsets, yOffsets });
				} else {
					const offsetX = clientX - element.x1;
					const offsetY = clientY - element.y1;
					setSelectedEl({ ...element, offsetX, offsetY });
				}

				setElements((prevState) => prevState);

				if (element.position === 'inside') {
					setAction('moving');
				} else {
					setAction('resizing');
				}
			}
		} else if (tool === 'eraser') {
			const element = getElementAtPosition(clientX, clientY, elements);
			if (element) {
				const newElements = [...elements];
				setElements(newElements.filter((el) => el.id !== element.id));
			}
		} else {
			const id = elements.length;
			const element = createElement(id, clientX, clientY, clientX, clientY, tool, style);
			setElements((prevState) => [...prevState, element]);
			setSelectedEl(element);
			setAction(tool === 'text' ? 'writing' : 'drawing');
		}
	};

	const handleMouseUp = (e) => {
		const { clientX, clientY } = e;
		if (selectedEl) {
			if (
				selectedEl.type === 'text' &&
				clientX - selectedEl.offsetX === selectedEl.x1 &&
				clientY - selectedEl.offsetY === selectedEl.y1
			) {
				setAction('writing');
				return;
			}

			const index = selectedEl.id;
			const { id, type } = elements[index];
			if ((action === 'drawing' || action === 'resizing') && adjustmentRequired(type)) {
				const { x1, x2, y1, y2 } = adjustElCoordinates(elements[index]);
				updateElement(id, x1, y1, x2, y2, type);
			}
		}

		if (action === 'writing') return;

		setAction('none');
		setSelectedEl(null);
	};

	const handleMouseMove = (e) => {
		const { clientX, clientY } = e;
		if (tool === 'selection') {
			const element = getElementAtPosition(clientX, clientY, elements);
			e.target.style.cursor = element ? cursorForPosition(element.position) : 'default';
		}
		if (tool === 'eraser') {
			const element = getElementAtPosition(clientX, clientY, elements);
			e.target.style.cursor = element ? cursorForPosition(element.position) : 'default';
		}
		if (action === 'drawing') {
			const index = elements.length - 1;
			const { x1, y1 } = elements[index];
			updateElement(index, x1, y1, clientX, clientY, tool);
		} else if (action === 'moving') {
			if (selectedEl.type === 'pencil') {
				const newPoints = selectedEl.points.map((_, index) => ({
					x: clientX - selectedEl.xOffsets[index],
					y: clientY - selectedEl.yOffsets[index],
				}));
				const elementsCopy = [...elements];
				elementsCopy[selectedEl.id] = {
					...elementsCopy[selectedEl.id],
					points: newPoints,
				};
				setElements(elementsCopy, true);
			} else {
				const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedEl;
				const width = x2 - x1;
				const height = y2 - y1;
				const newX1 = clientX - offsetX;
				const newY1 = clientY - offsetY;
				const options = type === 'text' ? { text: selectedEl.text } : {};
				updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
			}
		} else if (action === 'resizing') {
			const { id, type, position, ...coordinates } = selectedEl;
			const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
			updateElement(id, x1, y1, x2, y2, type);
		}
	};

	const clickColor = (e) => {
		setBackroundcolor(e.target.value);
	};

	const clickHide = () => {
		setHide(!hide);
	};

	const handleBlur = (e) => {
		const { id, x1, y1, type } = selectedEl;
		setAction('none');
		setSelectedEl(null);
		updateElement(id, x1, y1, null, null, type, { text: e.target.textContent });
	};

	return (
		<div className="App">
			<div className="toolsMenu__wrapper">
				<div className="toolsMenu">
					{types.map((el, i) => (
						<Button key={i} name={el} callback={setType} styleClass={styleClasses[i]} tool={tool} />
					))}
				</div>
			</div>
			<button className="hide-show-menu" onClick={() => clickHide()}>
				{hide ? 'Hide menu' : 'Show menu'}
			</button>
			{hide && (
				<>
					<div className="sideToolsMenu">
						<Button name="delete" callback={clearHistory} styleClass={'bxs-trash'} />
						<Button name="save" callback={memoizedSave} styleClass={'bx-save'} />
						<div className="sideToolsMenu__input">
							<input type="color" onChange={clickColor} value={backroundcolor} />
							<input type="text" value={backroundcolor} onChange={clickColor} />
						</div>
					</div>
					{tool !== 'selection' && <SideOptions style={style} setStyle={memoizedSetStyle} />}
					<div className="bottomTools">
						<Button name="undo" callback={undo} styleClass={'bx-undo'} />
						<Button name="redo" callback={redo} styleClass={'bx-redo'} />
						<Button name="eraser" styleClass={'bxs-eraser'} callback={setType} tool={tool} />
					</div>
				</>
			)}

			{action === 'writing' && (
				<span
					className="textarea"
					role="textbox"
					contentEditable
					ref={textAreaRef}
					onBlur={handleBlur}
					style={{ position: 'fixed', top: selectedEl.y1 - 5, left: selectedEl.x1 }}
				></span>
			)}
			<canvas
				id="canvas"
				className="canvas"
				width={window.innerWidth}
				height={window.innerHeight}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			></canvas>
		</div>
	);
}

export default App;
