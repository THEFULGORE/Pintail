import React, { useState } from 'react';
import './SideOptions.scss';

export const SideOptions = () => {
	const [strokeColor, setStrokeColor] = useState('#000000');
	const [fillStyle, setFillStyle] = useState('#ffffff');
	const [pattern, setPattern] = useState('solid');
	const [roughness, setRoughness] = useState(1);
	const [strokeWidth, setStrokeWidth] = useState(1);
	const [bowing, setBowing] = useState(1);
	const [strokeStyle, setStrokeStyle] = useState('straight');

	const handleStrokeColor = (e) => {
		setStrokeColor(e.target.value);
	};

	const handleFillStyle = (e) => {
		setFillStyle(e.target.value);
	};

	const handlePatternClick = (type) => {
		setPattern(type);
	};

	const handleStrokeWidth = (e) => {
		setStrokeWidth(e.target.value);
	};

	const handleRoughness = (e) => {
		setRoughness(e.target.value);
	};

	const handleBowing = (e) => {
		setBowing(e.target.value);
	};

	const handleStrokeStyle = (type) => {
		setStrokeStyle(type);
	};

	return (
		<div className="options">
			<div className="options__stroke-style">
				<h3>Color</h3>
				<div className="options__stroke-style-input">
					<input type="color" value={strokeColor} onChange={handleStrokeColor} />
					<input type="text" value={strokeColor} onChange={handleStrokeColor} />
				</div>
			</div>
			<div className="options__fill-style">
				<h3>Background</h3>
				<div className="options__fill-style-input">
					<input type="color" value={fillStyle} onChange={handleFillStyle} />
					<input type="text" value={fillStyle} onChange={handleFillStyle} />
				</div>
			</div>
			<div className="options__fill-pattern">
				<h3>Fill pattern</h3>
				<div className="options__fill-pattern-buttons">
					<button className="solid" onClick={() => handlePatternClick('solid')}>
						solid
					</button>
					<button className="zigzag" onClick={() => handlePatternClick('zigzag')}>
						zigzag
					</button>
					<button className="dashed" onClick={() => handlePatternClick('dashed')}>
						dashed
					</button>
					<button className="dots" onClick={() => handlePatternClick('dots')}>
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
					value={strokeWidth}
					onChange={handleStrokeWidth}
					class="stroke-width__slider"
				/>
			</div>
			<div className="options__roughness">
				<h3>Roughness</h3>
				<input
					type="range"
					id="slider"
					min="1"
					max="10"
					value={roughness}
					class="roughness__slider"
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
					value={bowing}
					class="roughness__slider"
					onChange={handleBowing}
				/>
			</div>
			<div className="options__stroke-style">
				<h3>Stroke style</h3>
				<div className="options__stroke-style-buttons">
					<button className="stroke-style__straight" onClick={() => handleStrokeStyle('straight')}>
						Straight
					</button>
					<button className="stroke-style__dashed" onClick={() => handleStrokeStyle('dashed')}>
						Dashed
					</button>
				</div>
			</div>
		</div>
	);
};
