import React from "react";
import { useEffect, useState, useRef } from "react";
import "../App.css";
import "./Paging.css";
import Pagination from "react-js-pagination";
import HashLoader from "react-spinners/HashLoader";
import { Link, useHistory } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import { postsState } from "../recoilStates";
import { useRecoilState } from "recoil";
import { provider } from "./firebase";
import { collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "./firebase";

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
	const [posts, setPosts] = useRecoilState(postsState);
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

	const fetchData = () => {
		let docs = {};
		getDocs(collection(db, "posts"), orderBy("created")).then(snapshots => {
			snapshots.forEach(doc => {
				docs[doc.id] = doc.data();
				console.log(`${doc.id} => ${doc.data()}`);
			});
			setPosts(docs);
		});
	};

	useEffect(() => {
		if (auth.currentUser !== null) {
			setIsLoggedIn(true);
		}
		fetchData();
		setWindowDimensions(getWindowDimensions());
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="App">
			<h1 style={{ marginTop: "30px" }}>Mental health</h1>
			<div style={{ marginBottom: "10px" }}>
				{isLoaded ? (
					<div ref={scrollRef}>
						{Object.keys(posts).map(
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
												justifyContent: "space-between",
												alignItems: "center",
												width:
													windowDimensions.width > 700
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
																700 && "2px",
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
			<div style={{ marginBottom: "30px" }}>
				{auth.currentUser?.email}
			</div>
		</div>
	);
};

export default Main;
