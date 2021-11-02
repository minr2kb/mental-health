import { useEffect, useState } from "react";
import "../App.css";
import { getAuth } from "firebase/auth";
import { Link, useHistory } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { postsState } from "../recoilStates";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Modal from "./components/Modal";

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
	const [isLoaded, setIsLoaded] = useState(false);
	const [posts, setPosts] = useRecoilState(postsState);
	const [isAnounymous, setIsAnounymous] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [modalMode, setModalMode] = useState("");

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
		if (auth.currentUser?.email == undefined) {
			window.alert(
				"Your login information is expired. Please Sign-in again"
			);
			history.push("/");
		}
		updateDoc(doc(db, "posts", id), {
			content: text,
			title: title,
			user:
				isAnounymous == null || isAnounymous
					? "anounymous"
					: auth.currentUser.email,
			username:
				isAnounymous == null || isAnounymous
					? "anounymous"
					: auth.currentUser.displayName,
			studentid:
				isAnounymous == null || isAnounymous ? "anounymous" : stuID,
			timestamp: new Date().toDateString(),
			created: new Date(),
		}).then(resp => {
			// window.alert("Saved all changes!");
			history.push("/");
		});
	};

	const getPost = () => {
		getDoc(doc(db, "posts", id)).then(snapshot => {
			setTitle(snapshot.data().title);
			setStuID(snapshot.data().studentid);
			setText(snapshot.data().content);
			setIsLoaded(true);
		});
	};

	const renderModal = () => {
		switch (modalMode) {
			case "is-anounymous":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Do you agree to provide your information to **ONLY RC team** for the prize? // - If you select '**No**', we do not collect any of your login information(*Completely anounymous*). //- If you select '**Yes**', you may selected as winner and your writing may be discussed through the video later. (*Anounymous to students*)"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							setIsAnounymous(false);
							setStuID("");
						}}
						no={() => {
							setIsOpen(false);
							setIsAnounymous(true);
							setStuID("anounymous");
						}}
					/>
				);
			case "update":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Do you want to update?"
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						yes={() => {
							setIsOpen(false);
							updatePost();
						}}
					/>
				);
			case "not-enough":
				return (
					<Modal
						width={windowDimensions.width > 700 ? "50vw" : "80vw"}
						content="Please fill in all the blanks."
						setIsOpen={setIsOpen}
						isOpen={isOpen}
						okay={() => {
							setIsOpen(false);
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

	useEffect(() => {
		if (isAnounymous) {
			console.log("anounymous");
			setStuID("anounymous");
		} else {
			console.log("not anounymous");
			setStuID("");
		}
	}, [isAnounymous]);

	return (
		// <div style={{ height: "100vh" }}>
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
					padding: windowDimensions.width > 700 ? "40px" : "20px",
					width: windowDimensions.width > 700 ? "60vw" : "85vw",
					height: "90vh",
					boxShadow:
						windowDimensions.width > 700 &&
						"rgba(138, 138, 138, 0.1) -3px 3px 10px 5px",
					marginTop: "2vh",
				}}
			>
				{isLoaded ? (
					<>
						<Link
							to={`/posts/${id}`}
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
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										width: "50%",
										alignItems: "center",
									}}
								>
									<input
										className="input stu"
										onChange={handleStuID}
										value={stuID}
										readOnly={isAnounymous}
										placeholder="Enter student ID"
									/>
									<div
										style={{
											color: "rgb(35,196,144)",
											cursor: "pointer",
										}}
										onClick={() => {
											setModalMode("is-anounymous");
											setIsOpen(true);
										}}
									>
										privacy change
									</div>
								</div>
							</div>
						</div>

						<textarea
							style={{
								border: "solid 1.5px darkgray",
								borderRadius: "7px",
								marginTop: "10px",
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
									boxShadow:
										"rgba(35,196,144, 0.2) 0px 0px 10px 5px",
									color: "white",
								}}
								onClick={() => {
									if (
										title.length < 1 ||
										text.length < 1 ||
										(isAnounymous !== null &&
											stuID.length < 1)
									) {
										setModalMode("not-enough");
									} else {
										setModalMode("update");
									}
									setIsOpen(true);
								}}
							>
								Save
							</div>
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
		</>
	);
};

export default Edit;
