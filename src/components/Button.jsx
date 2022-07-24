import React, { memo } from 'react';
import './Button.scss';

export const Button = memo(({ name, callback, styleClass, tool }) => {
	return (
		<button className={name + (tool === name ? ' active' : '')} onClick={() => callback(name)}>
			<i className={'bx ' + styleClass}></i>
		</button>
	);
});
