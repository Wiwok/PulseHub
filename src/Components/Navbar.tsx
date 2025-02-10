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

	return (
		<div className="Navbar">
			<h1>PulseHub</h1>
			<input ref={inputRef} onKeyUp={change} defaultValue={defaultValue} />
		</div>
	);
}

export default Navbar;
