import React from "react";
import { useEffect, useState, forwardRef, useRef } from "react";
import "../App.css";
import "./Paging.css";
import Pagination from "react-js-pagination";
import HashLoader from "react-spinners/HashLoader";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	signInWithRedirect,
	getRedirectResult,
} from "firebase/auth";
import { provider } from "./firebase";

function getNow() {
	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	let date = today.getDate();
	let hours = today.getHours();
	let minutes = today.getMinutes();
	let seconds = today.getSeconds();

	return (
		year +
		"/" +
		month +
		"/" +
		date +
		" " +
		hours +
		":" +
		minutes +
		":" +
		seconds
	);
}

const samples = {
	1: {
		title: "Test용1",
		content: "이것은 테스트용 글 쓰기1",
		user: "Kyungbae Min",
		like: 1,
		timestamp: new Date().toDateString(),
	},
	2: {
		title: "Test용2",
		content: "이것은 테스트용 글 쓰기2",
		user: "Kyungbae Min",
		like: 2,
		timestamp: new Date().toDateString(),
	},
	3: {
		title: "Test용3",
		content: "이것은 테스트용 글 쓰기3",
		user: "Kyungbae Min",
		like: 3,
		timestamp: new Date().toDateString(),
	},
	4: {
		title: "시험을 보기가 너무 싫고 종강 얼른 했으면 좋겠어요",
		content:
			"이것은 테스트용 글 쓰기4 sdfgsfgsf sfdg dfg efagfgsfd gdfg sfg sfgasg sfgsdf fgsddfsggs d gdfsg gfd gfgf gsdf gsg dsdg sdfgsd f fdhfds sdh gdsh sgdhd fg ",
		user: "Kyungbae Min",
		like: 4,
		timestamp: new Date().toDateString(),
	},
};

const Main = () => {
	let history = useHistory();
	const auth = getAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoaded, setIsLoaded] = useState(true);
	const itemsPerPage = 10;
	const scrollRef = useRef();
	const [page, setPage] = useState(1);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [currentPostID, setCurrentPostID] = useState("");
	const [posts, setPosts] = useState(samples);
	const [likes, setLikes] = useState([]);
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	const handlePageChange = page => {
		setPage(page);
		scrollRef.current.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const readPost = id => {
		setCurrentPostID(id);
		setModalIsOpen(true);
	};

	function getLikes() {
		// if (localStorage.getItem("likes") !== null) {
		// 	setLikes(JSON.parse(localStorage.getItem("likes")));
		// }
	}

	function like(id) {
		// setLikes([...likes, id]);
		// localStorage.setItem("likes", JSON.stringify([...likes, id]));
		// // db 업데이트
		// if (id !== null && id !== undefined && id !== "") {
		// 	update(ref(database, "chats/" + id), {
		// 		like: parseInt(chats[id].like) + 1,
		// 	});
		// }
	}

	const logIn = isPosting => {
		// signInWithRedirect(auth, provider).then(() =>
		signInWithPopup(auth, provider)
			.then(result => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const userData = result.user;
				if (
					userData.email.split("@")[1].toLowerCase() ==
						"stonybrook.edu" ||
					userData.email.split("@")[1].toLowerCase() == "fitnyc.edu"
				) {
					setIsLoggedIn(true);
					if (isPosting) {
						history.push("/write");
					}
				} else {
					window.alert(
						"Sign-In Failed: Please use university e-mail."
					);
					logOut();
				}
			})
			.catch(error => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The AuthCredential type that was used.
				const credential =
					GoogleAuthProvider.credentialFromError(error);
				// ...
			});
		// );
	};

	const logOut = () => {
		signOut(auth)
			.then(() => {
				console.log("Sign-out successful");
				setIsLoggedIn(false);
			})
			.catch(error => {});
	};

	useEffect(() => {
		if (auth.currentUser !== null) {
			setIsLoggedIn(true);
		}
		setWindowDimensions(getWindowDimensions());
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	// console.log(auth.currentUser?.email);
	return (
		<div className="App">
			<h1>Mental health</h1>
			<div style={{ marginBottom: "10px" }}>
				{isLoaded ? (
					<div ref={scrollRef}>
						{Object.keys(posts)
							.reverse()
							.map(
								(key, idx) =>
									(page - 1) * itemsPerPage <= idx &&
									idx < page * itemsPerPage && (
										<Link
											to={`/posts/${key}`}
											style={{
												textDecoration: "none",
												color: "inherit",
											}}
											key={key}
										>
											<div
												className="chat-box"
												style={{
													display: "flex",
													justifyContent:
														"space-between",
													alignItems: "center",
													width:
														windowDimensions.width >
														700
															? "60vw"
															: "85vw",
												}}
												onClick={() => readPost(key)}
											>
												<div
													style={{
														// paddingTop: "3px",
														// paddingBottom: "3px",
														padding: "3px",
													}}
												>
													<div
														style={{
															fontSize: "smaller",
															marginBottom: "5px",
														}}
													>
														{posts[key].timestamp}
													</div>
													<div
														style={{
															fontSize: "large",
															fontWeight: "500",
														}}
													>
														{posts[key].title}
													</div>
												</div>
												<div
													style={{
														fontSize: "smaller",
														display: "flex",
														flexDirection:
															windowDimensions.width <=
																700 && "column",
														alignItems: "center",
														justifyItems: "center",
													}}
												>
													<AiFillHeart color="coral" />

													<span
														style={{
															marginLeft:
																windowDimensions.width >
																	700 &&
																"2px",
														}}
													>
														{posts[key].like}
													</span>
												</div>
											</div>
										</Link>
									)
							)}
						<div
							style={{
								display: "flex",
								width: "100%",
								justifyContent: "end",
								paddingTop: "20px",
							}}
						>
							<div
								style={{
									// border: "solid 1px rgba(61, 61, 61, 0.5)",
									borderRadius: "7px",
									paddingLeft: "20px",
									paddingRight: "15px",
									paddingTop: "10px",
									paddingBottom: "10px",
									cursor: "pointer",
									backgroundColor: "rgb(35,196,144)",
									color: "white",
								}}
								onClick={() => {
									if (!isLoggedIn) {
										if (
											window.confirm(
												"To write a new post, you need to sign-in with univ. email. Would you like to login?"
											)
										) {
											logIn(true);
										}
									} else {
										history.push("/write");
									}
								}}
							>
								New +
							</div>
						</div>
						<Pagination
							activePage={page}
							itemsCountPerPage={itemsPerPage}
							totalItemsCount={Object.keys(posts).length}
							pageRangeDisplayed={5}
							prevPageText={"‹"}
							nextPageText={"›"}
							onChange={handlePageChange}
						/>
					</div>
				) : (
					<div style={{ padding: "2rem" }}>
						<HashLoader color="white" size={30} />
					</div>
				)}
			</div>
			{isLoggedIn ? (
				<div
					style={{
						// border: "solid 1px rgba(61, 61, 61, 0.5)",
						borderRadius: "7px",
						paddingLeft: "20px",
						paddingRight: "15px",
						paddingTop: "10px",
						paddingBottom: "10px",
						cursor: "pointer",
						// backgroundColor: "rgb(35,196,144)",
						color: "rgb(35,196,144)",
					}}
					onClick={() => {
						if (window.confirm("Do you want to sign-out?")) {
							logOut();
						}
					}}
				>
					Sign Out
				</div>
			) : (
				<div
					style={{
						// border: "solid 1px rgba(61, 61, 61, 0.5)",
						borderRadius: "7px",
						paddingLeft: "20px",
						paddingRight: "15px",
						paddingTop: "10px",
						paddingBottom: "10px",
						cursor: "pointer",
						// backgroundColor: "rgb(35,196,144)",
						color: "rgb(35,196,144)",
					}}
					onClick={() => logIn(false)}
				>
					Sign In
				</div>
			)}
			<div>{auth.currentUser?.email}</div>
		</div>
	);
};

export default Main;
