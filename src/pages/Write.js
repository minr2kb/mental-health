import { useEffect, useState, forwardRef, useRef } from "react";
import "../App.css";
import { getAuth } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const Write = () => {
	const auth = getAuth();
	let history = useHistory();
	const [windowDimensions, setWindowDimensions] = useState({
		width: 500,
		height: 500,
	});

	const [title, setTitle] = useState("");
	const [stuID, setStuID] = useState("");
	const [text, setText] = useState("");

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

	const createPost = async () => {
		if (auth.currentUser?.email == undefined) {
			window.alert(
				"Your login information is expired. Please Sign-in again"
			);
			history.push("/");
		}
		try {
			if (text.length < 1 || title.length < 1) {
				window.alert("Please fill in all the blanks.");
			} else {
				if (window.confirm("Do you want to post?")) {
					if (
						window.confirm(
							"Do you agree to provide your information to RC team for the prize? If you select 'cancel', we do not collect your login information(Completely anounymous)."
						)
					) {
						const docRef = await addDoc(collection(db, "posts"), {
							uid: auth.currentUser.uid,
							user: auth.currentUser.email,

							username: auth.currentUser.displayName,
							studentid: stuID,
							title: title,
							content: text,
							like: 0,
							likedusers: [],
							timestamp: new Date().toDateString(),
							created: new Date(),
						});

						window.alert("Posted!");
						history.push("/");
						console.log("Document written with ID: ", docRef.id);
					} else {
						const docRef = await addDoc(collection(db, "posts"), {
							uid: auth.currentUser.uid,
							user: "anounymous",
							username: "anounymous",
							studentid: "anounymous",
							title: title,
							content: text,
							like: 0,
							likedusers: [],
							timestamp: new Date().toDateString(),
							created: new Date(),
						});

						window.alert("Posted!");
						history.push("/");
						console.log("Document written with ID: ", docRef.id);
					}
				}
			}
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	};

	useEffect(() => {
		if (auth.currentUser?.email == undefined) {
			history.push("/");
		}
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
				<Link to="/posts" style={{ color: "rgb(35, 196, 144)" }}>
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
								fontWeight: "500",
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
								fontWeight: "500",
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
						marginTop: "10px",
						border: "solid 1.5px darkgray",
						borderRadius: "5px",
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
					placeholder={`- Writer's information will not be displayed on the post. \n\n- You can also write in Korean. \n\n- You can edit or delete after posting. \n\n- Do not write someone's name.`}
				/>
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
							// border: "solid 1px rgba(61, 61, 61, 0.5)",
							borderRadius: "7px",
							paddingLeft: "20px",
							paddingRight: "20px",
							paddingTop: "10px",
							paddingBottom: "10px",
							cursor: "pointer",
							backgroundColor: "rgb(35,196,144)",
							boxShadow: "rgba(35,196,144, 0.2) 0px 0px 10px 5px",
							color: "white",
						}}
						onClick={createPost}
					>
						Submit
					</div>
				</div>
			</div>
		</div>
	);
};

export default Write;
