import { useEffect, useState } from "react";
import "../App.css";
import { getAuth } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { postsState } from "../recoilStates";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const Edit = ({ match }) => {
	const { id } = match.params;
	const auth = getAuth();
	let history = useHistory();
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});

	const [title, setTitle] = useState("");
	const [stuID, setStuID] = useState("");
	const [text, setText] = useState("");

	const [posts, setPosts] = useRecoilState(postsState);

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	const handleTitle = e => {
		setTitle(e.target.value);
	};
	const handleStuID = e => {
		setStuID(e.target.value);
	};
	const handleText = e => {
		setText(e.target.value);
	};

	const updatePost = async () => {
		updateDoc(doc(db, "posts", id), {
			content: text,
			studentid: stuID,
			title: title,
			timestamp: new Date().toDateString(),
			created: new Date(),
		}).then(resp => {
			window.alert("Saved all changes!");
			history.push("/");
		});
	};

	useEffect(() => {
		if (auth.currentUser?.email == undefined) {
			history.push("/posts");
		}
		setTitle(posts[id].title);
		setStuID(posts[id].studentid);
		setText(posts[id].content);
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
					// overflow: "auto",
					// WebkitOverflowScrolling: "touch",
					padding: windowDimensions.width > 700 ? "40px" : "20px",
					width: windowDimensions.width > 700 ? "60vw" : "85vw",
					height: "90vh",
					boxShadow:
						windowDimensions.width > 700 &&
						"rgba(138, 138, 138, 0.1) -3px 3px 10px 5px",
					marginTop: "2vh",
				}}
			>
				<Link to={`/posts/${id}`}>
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
							display: "flex",
							alignItems: "center",
							justifyItems: "center",
							alignContent: "center",
						}}
					>
						<div
							style={{
								fontSize: "larger",
								fontWeight: "600",
								padding: "10px",
								// paddingTop: 0,
							}}
						>
							Title:
						</div>

						<input
							className="input"
							onChange={handleTitle}
							value={title}
						/>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyItems: "center",
							alignContent: "center",
						}}
					>
						<div
							style={{
								fontSize: "large",
								fontWeight: "600",
								padding: "10px",
							}}
						>
							Student ID:
						</div>

						<input
							className="input"
							onChange={handleStuID}
							value={stuID}
						/>
					</div>
				</div>

				<textarea
					style={{
						// outline: "none",
						// border: "none",
						marginTop: "10px",
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
					value={text}
					onChange={handleText}
				/>
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
							paddingRight: "20px",
							paddingTop: "10px",
							paddingBottom: "10px",
							cursor: "pointer",
							backgroundColor: "rgb(35,196,144)",
							color: "white",
						}}
						onClick={updatePost}
					>
						Save
					</div>
				</div>
			</div>
		</div>
	);
};

export default Edit;
