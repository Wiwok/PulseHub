import SearchIcon from '../Assets/Search.png';
import SearchPage from './SearchPage';
function Search({ setPage }: { setPage: Function }) {
	function handleChange(e) {
		setPage(SearchPage(e.target.value));
	}
	return (
		<div className="serach">
			<input type="text" className="searchInput" placeholder="Search" onInput={handleChange} />
			<img src={SearchIcon} alt="search" className="searchIcon" />
		</div>
	);
}

export default Search;
