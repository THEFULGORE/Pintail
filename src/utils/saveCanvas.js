export const saveCanvas = () => {
	const saveLink = document.createElement('a');
	saveLink.setAttribute('download', 'image.png');
	const dataURL = document.getElementById('canvas').toDataURL('image/png');
	const url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
	saveLink.setAttribute('href', url);
	saveLink.click();
};
