import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setUserID } from "../store/user/userSlice";
import { useEffect } from "react";

const Navbar = () => {
	const dispatch = useDispatch<AppDispatch>();

	const user: string = useSelector(
		(state: RootState) => state.user.userID
	);

	const onLogout = () => {
		dispatch(setUserID(""));
		window.location.href = "/login";	
	}

	useEffect(() => {
		console.log("In Nav")
		console.log(user)
		console.log("Local storage", localStorage.getItem('userID') ?? "")
	}, [])

	return (
		<nav className="bg-primary py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div onClick={() => { }} className="text-white font-bold text-4xl cursor-pointer"><span>Text-SQL</span></div>
				<ul className="flex space-x-4 items-center">
					<li>
						{user === "" &&
							(
								<div className="flex flex-row">
									<a
										href="/login"
										className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded mr-2"
									>
										Login
									</a>
									<a
										href="/signup"
										className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
									>
										Signup
									</a>
								</div>
							)
						}
						{user !== "" &&
							<a
								// href="/login"
								onClick={onLogout}
								className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
							>
								Logout
							</a>
						}
					</li>
				</ul>

			</div>
		</nav>
	);
};

export default Navbar;
