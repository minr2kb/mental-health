import { useEffect, useState, forwardRef, useRef } from "react";
import "../App.css";

import Pagination from "react-js-pagination";
import HashLoader from "react-spinners/HashLoader";
import { Link } from "react-router-dom";
import {
	AiOutlineArrowLeft,
	AiOutlineHeart,
	AiFillHeart,
	AiOutlineDelete,
} from "react-icons/ai";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	signInWithRedirect,
	getRedirectResult,
} from "firebase/auth";

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
		user: "kyungbae.min@stonybrook.edu",
		like: 4,
		timestamp: new Date().toDateString(),
	},
};

const Read = ({ match }) => {
	const { id } = match.params;
	const auth = getAuth();
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});
	const [posts, setPosts] = useState(samples);
	const [liked, setLiked] = useState(false);

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	const like = () => {
		setLiked(true);
	};
	const dislike = () => {
		setLiked(false);
	};

	useEffect(() => {
		setWindowDimensions(getWindowDimensions());
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div style={{ height: "100vh" }}>
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
					height: "90vh",
					boxShadow:
						windowDimensions.width > 700 &&
						"rgba(138, 138, 138, 0.1) -3px 3px 10px 5px",
					marginTop: "2vh",
				}}
			>
				<Link to="/posts">
					<AiOutlineArrowLeft style={{ padding: "10px" }} size={20} />
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
							fontWeight: "600",
							padding: "10px",
							paddingBottom: 0,
						}}
					>
						Title: {posts[id]?.title}
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
							{posts[id]?.timestamp}
						</div>
						<div style={{ display: "flex" }}>
							{posts[id]?.user == auth.currentUser?.email && (
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
									// onClick={liked ? dislike : like}
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
									<div style={{ padding: "3px" }}>Like</div>
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

				<textarea
					style={{
						outline: "none",
						border: "none",
						borderTop: "solid 1.5px grey",
						fontSize: "large",
						fontWeight: "400",
						padding: "10px",
						height: "100%",
						width: "calc(100% - 20px)",
						resize: "none",
						fontFamily:
							"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
						lineHeight: "130%",
					}}
					readOnly={true}
					value={posts[id]?.content}
				/>
			</div>
		</div>
	);
};

export default Read;
