const Navbar = () => {

	return (
		<nav className="bg-primary py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div onClick={() => {}} className="text-white font-bold text-4xl cursor-pointer"><span>Text-SQL</span></div>
				<ul className="flex space-x-4 items-center">
					<li>
						<a
						 	href="/history"
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
						>
						Logout
						</a>
					</li>
				</ul>

			</div>
		</nav>
	);
};

export default Navbar;
