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
	signInWithRedirect,
	getRedirectResult,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import { postsState } from "../recoilStates";
import { useRecoilState } from "recoil";
import { provider } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import Modal from "./components/Modal";
import titleIMG from "../assets/title.png";

const Main = () => {
	let history = useHistory();
	const auth = getAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [modalMode, setModalMode] = useState("");
	const itemsPerPage = 10;
	const scrollRef = useRef();
	const [page, setPage] = useState(1);
	const [userAgent, setUserAgent] = useState("");
	const [copied, setCopied] = useState(false);

	const linkInput = useRef();

	const [posts, setPosts] = useRecoilState(postsState);
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

	const logIn = isPosting => {
		// signInWithRedirect(auth, provider).then(() =>
		// 	getRedirectResult(auth)
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
					userData.email.split("@")[1].toLowerCase() ==
						"fitnyc.edu" ||
					userData.email.split("@")[1].toLowerCase() ==
						"sunykorea.ac.kr"
				) {
					setIsLoggedIn(true);
					if (isPosting) {
						history.push("/write");
					}
				} else {
					logOut();
					window.alert(
						"Sign-In Failed: Please use university e-mail."
					);
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
				console.log("Sign-out successfully");
				setIsLoggedIn(false);
			})
			.catch(error => {});
	};

	const fetchData = () => {
		let docs = {};
		getDocs(
			query(collection(db, "posts"), orderBy("created", "desc"))
		).then(snapshots => {
			snapshots.forEach(doc => {
				docs[doc.id] = doc.data();
				// console.log(`${doc.id} => ${doc.data()}`);
			});
			setPosts(docs);
			setIsLoaded(true);
		});
	};

	const copy = () => {
		const el = linkInput.current;
		el.select();
		navigator.clipboard.writeText(el.value);
		setCopied(true);
	};

	const renderModal = () => {
		switch (modalMode) {
			case "new-post":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="To write a new post, you need to sign-in with **univ. email**. Would you like to login?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							logIn(true);
						}}
					/>
				);
			case "sign-in":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Only **univ. email** will be accepted. // ex) john.doe **@stonybrook.edu**, John.Doe **@FITNYC.edu**"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						okay={() => {
							setIsOpen(false);
							logIn(false);
						}}
					/>
				);
			case "sign-out":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Do you want to sign-out?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							logOut();
						}}
					/>
				);
		}
	};

	useEffect(() => {
		setUserAgent(navigator.userAgent);
		console.log(navigator.userAgent);
		if (navigator.userAgent.includes("KAKAOTALK")) {
			window.alert(
				"This browser is not supported. PLEASE open this page with Safari or Chrome."
			);
		}
		fetchData();
		setWindowDimensions(getWindowDimensions());
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		console.log(auth.currentUser?.email);
		if (auth.currentUser?.email !== undefined) {
			setIsLoggedIn(true);
		}
	}, [auth.currentUser]);

	return (
		<div className="App">
			{isOpen && renderModal()}
			{!userAgent.includes("KAKAOTALK") && isLoaded && (
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-end",
						marginTop: "1rem",
						width: "100%",
					}}
				>
					<b>
						{auth.currentUser?.displayName}
						{auth.currentUser?.email.split("@")[1].toLowerCase() ==
							"sunykorea.ac.kr" && " (admin)"}
					</b>
					{isLoggedIn ? (
						<div
							style={{
								// border: "solid 1px rgba(61, 61, 61, 0.5)",
								borderRadius: "7px",
								paddingLeft: "5px",
								// paddingRight: "15px",
								paddingTop: "10px",
								paddingBottom: "10px",
								cursor: "pointer",

								color: "rgb(35,196,144)",
								width: "5rem",
							}}
							onClick={() => {
								setModalMode("sign-out");
								setIsOpen(true);
							}}
						>
							Sign Out
						</div>
					) : (
						<div
							style={{
								borderRadius: "7px",
								paddingLeft: "10px",
								// paddingRight: "15px",
								paddingTop: "10px",
								paddingBottom: "10px",
								cursor: "pointer",

								color: "rgb(35,196,144)",
								width: "5rem",
							}}
							onClick={() => {
								setModalMode("sign-in");
								setIsOpen(true);
							}}
						>
							Sign In
						</div>
					)}
				</div>
			)}

			<h3
				style={{
					// marginTop: "2rem",
					marginBottom: 0,
					cursor: "pointer",
					// color: "rgb(100,100,100)",
				}}
			>
				2021 FA RC Event
			</h3>
			{/* <h1
				style={{ marginTop: "0", cursor: "pointer", paddingTop: 0 }}
				onClick={() =>
					window.open(
						"https://mental-health-rc2021f.web.app/",
						"_self"
					)
				}
			>
				It's Okay
			</h1> */}
			<img
				src={titleIMG}
				style={{ padding: "10px" }}
				alt="title"
				width={windowDimensions.width > 700 ? "40%" : "80%"}
				onClick={() =>
					window.open(
						"https://mental-health-rc2021f.web.app/",
						"_self"
					)
				}
			/>
			<div style={{ marginBottom: "10px" }}>
				{userAgent.includes("KAKAOTALK") ? (
					<div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
						<div
							style={{
								fontSize: "large",
								fontWeight: "400",
								margin: "10px",
							}}
						>
							[Browse not Supported]
							<p>Please open this page with Safari or Chrome.</p>
						</div>
						<>
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									flexDirection:
										windowDimensions.width <= 700 &&
										"column",
									alignContent: "center",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<input
									className="input"
									style={{
										width:
											windowDimensions.width > 700
												? "40vw"
												: "90vw",
									}}
									type="text"
									value="https://mental-health-rc2021f.web.app/"
									ref={linkInput}
									readOnly
								></input>
								<div
									style={{
										borderRadius: "7px",
										paddingLeft: "20px",
										paddingRight: "20px",
										paddingTop: "10px",
										paddingBottom: "10px",
										marginLeft: "5px",
										cursor: "pointer",
										backgroundColor: "rgb(35,196,144)",
										boxShadow:
											"rgba(35,196,144, 0.2) 0px 0px 10px 5px",
										// width:
										// 	windowDimensions.width > 700 &&
										// 	"fit-content",
										margin: "10px",

										color: "white",
									}}
									onClick={copy}
								>
									{copied ? "Copied!" : "Copy"}
								</div>
							</div>

							{copied ? (
								<div style={{ color: "green" }}>Copied!</div>
							) : null}
						</>
					</div>
				) : isLoaded ? (
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
										>
											<div
												style={{
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
													padding: "3px",
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
													{
														posts[key].likedusers
															.length
													}
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
								justifyContent: "flex-end",

								paddingTop: "20px",
							}}
						>
							<div
								style={{
									borderRadius: "7px",
									paddingLeft: "20px",
									paddingRight: "15px",
									paddingTop: "10px",
									paddingBottom: "10px",
									cursor: "pointer",
									backgroundColor: "rgb(35,196,144)",
									boxShadow:
										"rgba(35,196,144, 0.2) 0px 0px 10px 5px",

									color: "white",
								}}
								onClick={() => {
									if (!isLoggedIn) {
										setModalMode("new-post");
										setIsOpen(true);
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
						{/* <div>{auth.currentUser?.email}</div> */}
						{/* <div
							style={{
								marginBottom: "30px",
								overflowWrap: "anywhere",
								width: "50vw",
							}}
						>
							{userAgent}
						</div> */}
					</div>
				) : (
					<div style={{ padding: "2rem" }}>
						<HashLoader color="#23C490" size={30} />
					</div>
				)}
			</div>
			<footer>
				<div
					style={{
						textAlign: "center",
						fontSize: "smaller",
						color: "rgba(100, 100, 100, 0.5)",
						paddingBottom: "30px",
					}}
				>
					© 2021. (Kyungbae Min) all rights reserved
				</div>
			</footer>
		</div>
	);
};

export default Main;
