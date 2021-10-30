import { useEffect, useState } from "react";
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
import { getAuth } from "firebase/auth";
import {
	doc,
	updateDoc,
	increment,
	arrayUnion,
	arrayRemove,
	deleteDoc,
	getDoc,
	collection,
} from "firebase/firestore";
import { db } from "./firebase";

const Read = ({ match }) => {
	const { id } = match.params;
	const auth = getAuth();
	let history = useHistory();
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});
	const [posts, setPosts] = useRecoilState(postsState);
	const [liked, setLiked] = useState(false);
	const [post, setPost] = useState({});
	const [isLoaded, setIsLoaded] = useState(false);

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	const like = () => {
		if (auth.currentUser?.email == undefined) {
			window.alert(
				"You have to sign-in in order to click the like buttons."
			);
		} else {
			updateDoc(doc(db, "posts", id), {
				like: increment(1),
				likedusers: arrayUnion(auth.currentUser?.uid),
			}).then(resp => setLiked(true));
		}
	};

	const dislike = () => {
		updateDoc(doc(db, "posts", id), {
			like: increment(-1),
			likedusers: arrayRemove(auth.currentUser?.uid),
		}).then(resp => setLiked(false));
	};

	const deletePost = () => {
		if (window.confirm("Do you really want to delete this post?")) {
			deleteDoc(doc(db, "posts", id)).then(resp => {
				history.push("/");
			});
		}
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
			setIsLoaded(true);
		});
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
		<div style={{ height: "90vh" }}>
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
					height: "80vh",
					boxShadow:
						windowDimensions.width > 700 &&
						"rgba(138, 138, 138, 0.1) -3px 3px 10px 5px",
					marginTop: "2vh",
				}}
			>
				{isLoaded ? (
					<>
						<Link to="/posts">
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
											onClick={deletePost}
										>
											{windowDimensions.width > 700 && (
												<div style={{ padding: "3px" }}>
													Delete
												</div>
											)}
											<AiOutlineDelete />
										</div>
									)}
									<div
										style={{
											display: "flex",
											alignItems: "center",
											border: "solid 1px rgba(61, 61, 61, 0.5)",
											borderRadius: "8px",
											padding: "5px",
											cursor: "pointer",
										}}
										onClick={liked ? dislike : like}
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
								</div>
							</div>
						</div>
						<div
							style={{
								borderTop: "solid 1.5px grey",
								width: "100%",
							}}
						>
							<textarea
								style={{
									outline: "none",
									border: "none",
									// borderTop: "solid 1.5px grey",
									fontSize: "large",
									fontWeight: "400",
									padding: "10px",
									height: "60vh",
									width: "calc(100% - 20px)",
									resize: "none",
									fontFamily:
										"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
									lineHeight: "130%",
								}}
								readOnly={true}
								value={post?.content}
							/>
						</div>
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
		</div>
	);
};

export default Read;
