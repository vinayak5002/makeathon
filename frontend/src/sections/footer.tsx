import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { timeAgo } from "../utils/utils";

const Footer = () => {

	const currentRepoPath = useSelector(
		(state: RootState) => state.currentRepoPath.path,
	)

	const lastIndexed = useSelector(
		(state: RootState) => state.currentRepoPath.lastIndexed,
	);


	
	return (
		<nav className="bg-secondary py-4 flex justify-between">
			<div className="container mx-auto flex justify-between">
				<div className="text-white font-bold text-lg"></div>
				<ul className="flex space-x-4">
					<li>
						<a className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Current repo: {currentRepoPath}</a>
						<a className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Last indexed: {timeAgo(lastIndexed)}</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Footer;