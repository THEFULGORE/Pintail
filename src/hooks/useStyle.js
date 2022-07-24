import { useState } from 'react';

export const useStyle = (initialState) => {
	const [style, setStyle] = useState(initialState);

	const setState = (key, newValue) => {
		setStyle((prevState) => ({ ...prevState, [key]: newValue }));
	};

	return [style, setState];
};
