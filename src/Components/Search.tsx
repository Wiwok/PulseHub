import SearchIcon from '../Assets/Search.png';

function Search({ setPage }: { setPage: Function }) {
	function handleChange(e: any) {
		setPage('Search');
	}

	return (
		<div className="search">
			<input type="text" id="searchInput" className="searchInput" placeholder="Search" onInput={handleChange} />
			<img src={SearchIcon} alt="search" className="searchIcon" />
		</div>
	);
}

export default Search;
