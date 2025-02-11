function Button({ value, onClick }: { value: string; onClick?: () => void }) {
	return (
		<div className="Button" onClick={onClick}>
			{value}
		</div>
	);
}

export default Button;
