class ContextMenu {
	private options: ContextMenuOptions[];
	private setContextMenu: Function;
	constructor(setContextMenu: Function, options: ContextMenuOptions[]) {
		this.setContextMenu = setContextMenu;
		this.options = options;
	}

	dispawn() {
		this.setContextMenu(<></>);
	}

	click(ev: any) {
		this.setContextMenu(
			<div className="ContextMenuBody" onContextMenu={this.dispawn.bind(this)} onClick={this.dispawn.bind(this)}>
				<div className="ContextMenuBox" style={{ left: ev.clientX, top: ev.clientY }}>
					{this.options.map((el, i) => {
						return (
							<div
								className="ContextMenuElement"
								onClick={() => {
									el.callback();
								}}
								key={i}
							>
								{el.value}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default ContextMenu;
