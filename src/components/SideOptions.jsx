import React, { memo } from 'react';
import './SideOptions.scss';

export const SideOptions = memo(({ style, setStyle }) => {
	const handleStrokeColor = (e) => {
		setStyle('strokeColor', e.target.value);
	};

	const handleFillStyle = (e) => {
		setStyle('fillStyle', e.target.value);
	};

	const handlePatternClick = (type) => {
		setStyle('pattern', type);
	};

	const handleStrokeWidth = (e) => {
		setStyle('strokeWidth', e.target.value);
	};

	const handleRoughness = (e) => {
		setStyle('roughness', e.target.value);
	};

	const handleBowing = (e) => {
		setStyle('bowing', e.target.value);
	};

	const handleStrokeStyle = (type) => {
		setStyle('strokeStyle', type);
	};

	return (
		<div className="options">
			<div className="options__stroke-style">
				<h3>Color</h3>
				<div className="options__stroke-style-input">
					<input type="color" value={style.strokeColor} onChange={handleStrokeColor} />
					<input type="text" value={style.strokeColor} onChange={handleStrokeColor} />
				</div>
			</div>
			<div className="options__fill-style">
				<h3>Background</h3>
				<div className="options__fill-style-input">
					<input type="color" value={style.fillStyle} onChange={handleFillStyle} />
					<input type="text" value={style.fillStyle} onChange={handleFillStyle} />
				</div>
			</div>
			<div className="options__fill-pattern">
				<h3>Fill pattern</h3>
				<div className="options__fill-pattern-buttons">
					<button
						className={'solid' + (style.pattern === 'solid' ? ' pattern-active' : '')}
						onClick={() => handlePatternClick('solid')}
					>
						solid
					</button>
					<button
						className={'zigzag' + (style.pattern === 'zigzag' ? ' pattern-active' : '')}
						onClick={() => handlePatternClick('zigzag')}
					>
						zigzag
					</button>
					<button
						className={'dashed' + (style.pattern === 'dashed' ? ' pattern-active' : '')}
						onClick={() => handlePatternClick('dashed')}
					>
						dashed
					</button>
					<button
						className={'dots' + (style.pattern === 'dots' ? ' pattern-active' : '')}
						onClick={() => handlePatternClick('dots')}
					>
						dots
					</button>
				</div>
			</div>
			<div className="options__stroke-width">
				<h3>Width</h3>
				<input
					type="range"
					id="slider"
					min="1"
					max="50"
					value={style.strokeWidth}
					onChange={handleStrokeWidth}
					className="stroke-width__slider"
				/>
			</div>
			<div className="options__roughness">
				<h3>Roughness</h3>
				<input
					type="range"
					id="slider"
					min="1"
					max="10"
					value={style.roughness}
					className="roughness__slider"
					onChange={handleRoughness}
				/>
			</div>
			<div className="options__bowing">
				<h3>Bowing</h3>
				<input
					type="range"
					id="slider"
					min="0"
					max="10"
					value={style.bowing}
					className="roughness__slider"
					onChange={handleBowing}
				/>
			</div>
			<div className="options__stroke-style">
				<h3>Stroke style</h3>
				<div className="options__stroke-style-buttons">
					<button
						className={
							'stroke-style__straight' + (style.strokeStyle === 'straight' ? ' pattern-active' : '')
						}
						onClick={() => handleStrokeStyle('straight')}
					>
						Straight
					</button>
					<button
						className={
							'stroke-style__dashed' + (style.strokeStyle === 'dashed' ? ' pattern-active' : '')
						}
						onClick={() => handleStrokeStyle('dashed')}
					>
						Dashed
					</button>
				</div>
			</div>
		</div>
	);
});
