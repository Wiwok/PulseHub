import { createRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Navbar() {
	const inputRef = createRef<HTMLInputElement>();
	const navigate = useNavigate();

	const defaultValue = useSearchParams()[0].get('q') as string;

	function change(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			navigate('/search?q=' + inputRef.current?.value);
		} else {
			const oldValue = inputRef.current?.value;
			setTimeout(() => {
				if (oldValue == inputRef.current?.value) {
					navigate('/search?q=' + inputRef.current?.value);
				}
			}, 250);
		}
	}

	function homeClick() {
		if (inputRef.current?.value) {
			inputRef.current.value = '';
		}

		navigate('/');
	}

	return (
		<div className="Navbar">
			<h1 onClick={homeClick}>PulseHub</h1>
			<input ref={inputRef} onKeyUp={change} defaultValue={defaultValue} placeholder="Search" />
		</div>
	);
}

export default Navbar;
