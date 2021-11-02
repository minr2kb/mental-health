import { useEffect, useState, useRef } from "react";
import "../App.css";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { postsState } from "../recoilStates";
import HashLoader from "react-spinners/HashLoader";
import {
	AiOutlineArrowLeft,
	AiOutlineHeart,
	AiFillHeart,
	AiOutlineDelete,
	AiOutlineEdit,
} from "react-icons/ai";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import { provider } from "./firebase";
import {
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	deleteDoc,
	getDoc,
	getDocs,
	query,
	addDoc,
	collection,
	orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import Modal from "./components/Modal";

const Read = ({ match }) => {
	const { id } = match.params;
	const auth = getAuth();
	let history = useHistory();
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});
	const [replies, setReplies] = useState([]);
	const [currentReplyID, setCurrentReplyID] = useState("");
	const [liked, setLiked] = useState(false);
	const [post, setPost] = useState({});
	const [isLoaded, setIsLoaded] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [modalMode, setModalMode] = useState("");
	const [msg, setMsg] = useState("");

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	const logIn = () => {
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
					window.location.reload();
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
			})
			.catch(error => {});
	};

	const like = () => {
		updateDoc(doc(db, "posts", id), {
			likedusers: arrayUnion(auth.currentUser?.uid),
		}).then(resp => setLiked(true));
	};

	const dislike = () => {
		updateDoc(doc(db, "posts", id), {
			likedusers: arrayRemove(auth.currentUser?.uid),
		}).then(resp => setLiked(false));
	};

	const likeReply = replyID => {
		updateDoc(doc(db, "posts", id, "replies", replyID), {
			likedusers: arrayUnion(auth.currentUser?.uid),
		}).then(resp => getReplies());
	};

	const dislikeReply = replyID => {
		updateDoc(doc(db, "posts", id, "replies", replyID), {
			likedusers: arrayRemove(auth.currentUser?.uid),
		}).then(resp => getReplies());
	};

	const reply = () => {
		let newReply = {
			uid: auth.currentUser?.uid,
			date:
				new Date().toDateString() +
				" " +
				new Date().toTimeString().split(" ")[0],
			content: msg,
			likedusers: [],
			created: new Date(),
		};

		addDoc(collection(db, "posts", id, "replies"), newReply).then(resp => {
			setReplies([{ id: resp.id, ...newReply }, ...replies]);
			setMsg("");
		});
	};

	const deletePost = () => {
		deleteDoc(doc(db, "posts", id)).then(resp => {
			history.push("/");
		});
	};

	const deleteReply = () => {
		deleteDoc(doc(db, "posts", id, "replies", currentReplyID)).then(
			resp => {
				getReplies();
			}
		);
	};

	const getPost = () => {
		getDoc(doc(db, "posts", id)).then(snapshot => {
			setPost(snapshot.data());
			if (
				snapshot
					.data()
					?.likedusers.filter(user => user == auth.currentUser?.uid)
					.length > 0
			) {
				setLiked(true);
			}

			getReplies();
		});
	};

	const getReplies = () => {
		let docs = [];
		getDocs(
			query(
				collection(db, "posts", id, "replies"),
				orderBy("created", "desc")
			)
		).then(snapshots => {
			snapshots.forEach(doc => {
				docs.push({ id: doc.id, ...doc.data() });
			});
			setReplies(docs);
			setIsLoaded(true);
		});
	};

	const handleOnChange = e => {
		setMsg(e.target.value);
	};

	const enter = e => {
		if (e.key === "Enter") {
			reply();
		}
	};

	const renderModal = () => {
		switch (modalMode) {
			case "unauthorized-like":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="To press like, you need to sign-in with **univ. email**. Would you like to login?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							logIn();
						}}
					/>
				);
			case "unauthorized-reply":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="To reply to this post, you need to sign-in with **univ. email**. Would you like to login?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							logIn();
						}}
					/>
				);

			case "delete":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Do you want to delete this post?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							deletePost();
						}}
					/>
				);
			case "delete-reply":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Do you want to delete this reply?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							deleteReply();
						}}
					/>
				);
		}
	};

	useEffect(() => {
		getPost();
		setWindowDimensions(getWindowDimensions());
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			{isOpen && renderModal()}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					border:
						windowDimensions.width > 700 &&
						"1px solid rgba(61, 61, 61, 0.2)",
					borderRadius: "10px",
					overflow: "auto",
					WebkitOverflowScrolling: "touch",
					padding: windowDimensions.width > 700 ? "40px" : "20px",
					width: windowDimensions.width > 700 ? "60vw" : "85vw",
					// height: "80vh",
					boxShadow:
						windowDimensions.width > 700 &&
						"rgba(138, 138, 138, 0.1) -3px 3px 10px 5px",
					marginTop: "2vh",
				}}
			>
				{isLoaded ? (
					<>
						<Link
							to="/posts"
							style={{ color: "rgb(35, 196, 144)" }}
						>
							<AiOutlineArrowLeft
								style={{ padding: "10px" }}
								size={20}
							/>
						</Link>
						<div
							style={{
								textAlign: "start",
								width: "100%",
							}}
						>
							<div
								style={{
									fontSize: "larger",
									fontWeight: "500",
									padding: "10px",
									paddingBottom: 0,
								}}
							>
								Title: {post?.title}
							</div>
							<div
								style={{
									display: "flex",
									marginTop: "10px",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "10px",
									paddingTop: 0,
								}}
							>
								<div
									style={{
										fontSize: "large",
										fontWeight: "400",
									}}
								>
									{windowDimensions.width > 700 && "Date: "}
									{post?.timestamp}
								</div>
								<div style={{ display: "flex" }}>
									{post?.uid == auth.currentUser?.uid && (
										<div
											style={{
												display: "flex",
												alignItems: "center",
												border: "solid 1px rgba(61, 61, 61, 0.5)",
												borderRadius: "8px",
												padding: "5px",
												cursor: "pointer",
												marginRight: "5px",
											}}
											onClick={() =>
												history.push(`/write/${id}`)
											}
										>
											{windowDimensions.width > 700 && (
												<div style={{ padding: "3px" }}>
													Edit
												</div>
											)}
											<AiOutlineEdit />
										</div>
									)}
									{post?.uid == auth.currentUser?.uid ||
										(auth.currentUser?.email
											.split("@")[1]
											.toLowerCase() ==
											"sunykorea.ac.kr" && (
											<div
												style={{
													display: "flex",
													alignItems: "center",
													border: "solid 1px rgba(61, 61, 61, 0.5)",
													borderRadius: "8px",
													padding: "5px",
													cursor: "pointer",
													marginRight: "5px",
												}}
												onClick={() => {
													setModalMode("delete");
													setIsOpen(true);
												}}
											>
												{windowDimensions.width >
													700 && (
													<div
														style={{
															padding: "3px",
														}}
													>
														Delete
													</div>
												)}
												<AiOutlineDelete />
											</div>
										))}
									{post?.uid !== auth.currentUser?.uid && (
										<div
											style={{
												display: "flex",
												alignItems: "center",
												border: "solid 1px rgba(61, 61, 61, 0.5)",
												borderRadius: "8px",
												padding: "5px",
												cursor: "pointer",
											}}
											onClick={
												auth.currentUser?.email ==
												undefined
													? () => {
															setModalMode(
																"unauthorized-like"
															);
															setIsOpen(true);
													  }
													: liked
													? dislike
													: like
											}
										>
											{windowDimensions.width > 700 && (
												<div style={{ padding: "3px" }}>
													Like
												</div>
											)}
											{liked ? (
												<AiFillHeart color="coral" />
											) : (
												<AiOutlineHeart />
											)}
										</div>
									)}
								</div>
							</div>
						</div>
						<div
							style={{
								borderTop: "solid 1.5px grey",
								width: "100%",
							}}
						>
							<div
								style={{
									textAlign: "start",
									fontSize: "large",
									fontWeight: "400",
									padding: "10px",
									marginBottom: "50px",
									fontFamily:
										"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
									lineHeight: "130%",
									whiteSpace: "pre-wrap",
								}}
							>
								{post?.content}
							</div>
						</div>
						<div
							style={{
								display: windowDimensions.width > 700 && "flex",
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}
							onClick={
								auth.currentUser?.email == undefined
									? () => {
											setModalMode("unauthorized-reply");
											setIsOpen(true);
									  }
									: () => {}
							}
						>
							<input
								className="input"
								style={{
									width:
										windowDimensions.width > 700
											? "40vw"
											: "85vw",
								}}
								onChange={handleOnChange}
								onKeyPress={enter}
								value={msg}
								placeholder="Reply"
								disabled={auth.currentUser?.email == undefined}
							/>
							<div
								style={{
									borderRadius: "7px",
									paddingLeft: "20px",
									paddingRight: "20px",
									paddingTop: "10px",
									paddingBottom: "10px",
									cursor: "pointer",
									backgroundColor: "rgb(35,196,144)",
									boxShadow:
										"rgba(35,196,144, 0.2) 0px 0px 10px 5px",
									color: "white",

									margin: "10px",
									marginTop:
										windowDimensions.width <= 700 && "10px",
								}}
								onClick={
									auth.currentUser?.email == undefined
										? () => {}
										: reply
								}
							>
								Send
							</div>
						</div>
						{replies.map((reply, idx) => (
							<div
								className="reply"
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
								key={reply.date}
							>
								<div>
									<div
										style={{
											fontSize: "small",
											marginBottom: "5px",
										}}
									>
										{reply.date}
										{reply.uid == post?.uid && (
											<b> (Author)</b>
										)}
									</div>
									<div
										style={{
											fontSize: "medium",
											fontWeight: "500",
										}}
									>
										{reply.content}
									</div>
								</div>
								<div
									style={{
										fontSize: "small",
										display: "flex",
										flexDirection:
											windowDimensions.width <= 700 &&
											"column",
										alignItems: "center",
										justifyItems: "center",
									}}
								>
									{reply.uid == auth.currentUser?.uid ||
									auth.currentUser?.email
										.split("@")[1]
										.toLowerCase() == "sunykorea.ac.kr" ? (
										<AiOutlineDelete
											style={{
												cursor: "pointer",
											}}
											size={17}
											onClick={() => {
												setCurrentReplyID(reply.id);
												setModalMode("delete-reply");
												setIsOpen(true);
											}}
										/>
									) : (
										<>
											{reply.likedusers.includes(
												auth.currentUser?.uid
											) ? (
												<AiFillHeart
													style={{
														cursor: "pointer",
														color: "coral",
													}}
													onClick={
														auth.currentUser
															?.email == undefined
															? () => {
																	setModalMode(
																		"unauthorized-like"
																	);
																	setIsOpen(
																		true
																	);
															  }
															: () =>
																	dislikeReply(
																		reply.id
																	)
													}
												/>
											) : (
												<AiOutlineHeart
													style={{
														cursor: "pointer",
														marginTop: "1px",
													}}
													onClick={
														auth.currentUser
															?.email == undefined
															? () => {
																	setModalMode(
																		"unauthorized-like"
																	);
																	setIsOpen(
																		true
																	);
															  }
															: () =>
																	likeReply(
																		reply.id
																	)
													}
												/>
											)}
											<div>{reply.likedusers.length}</div>
										</>
									)}
								</div>
							</div>
						))}
					</>
				) : (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							height: "100%",
						}}
					>
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
						padding: "30px",
					}}
				>
					© 2021. (Kyungbae Min) all rights reserved
				</div>
			</footer>
		</>
	);
};

export default Read;
