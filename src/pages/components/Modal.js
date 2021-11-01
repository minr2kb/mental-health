import React from "react";

const Modal = ({
	width,
	title,
	content,
	yes,
	no,
	okay,
	setIsOpen,
	isOpen,
	inevitable,
}) => {
	return (
		<div
			style={{
				display: "flex",
				position: "fixed",
				width: "100vw",
				height: "100vh",
				backgroundColor: "rgba(0,0,0,0.3)",
				justifyContent: "center",
				alignItems: "center",
			}}
			onClick={() => inevitable || setIsOpen(!isOpen)}
		>
			<div
				style={{
					width: width,
					// minHeight: "10rem",
					backgroundColor: "white",
					boxShadow: "rgba(138, 138, 138, 0.2) -3px 3px 10px 5px",
					borderRadius: "8px",
					padding: "15px",
				}}
				onClick={e => e.stopPropagation()}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						// justifyItems: "space-between",
						// alignContent: "space-between",
					}}
				>
					{title && <h3>{title}</h3>}
					<div
						style={{
							padding: "10px",
							paddingBottom: "30px",
							textAlign: "start",
						}}
					>
						{content}
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: yes ? "space-between" : "center",
						}}
					>
						{yes && (
							<div
								style={{
									borderRadius: "7px",
									paddingLeft: "10px",
									paddingRight: "20px",
									paddingTop: "10px",
									paddingBottom: "10px",
									cursor: "pointer",
									color: "rgb(35,196,144)",
									// width: "",
								}}
								onClick={() => {
									setIsOpen(false);
								}}
							>
								Cancel
							</div>
						)}
						<div style={{ display: "flex" }}>
							{no && (
								<div
									style={{
										border: "solid 1.5px rgba(61, 61, 61, 0.3)",
										borderRadius: "7px",
										paddingLeft: "25px",
										paddingRight: "25px",
										paddingTop: "10px",
										paddingBottom: "10px",
										marginRight: "10px",
										cursor: "pointer",
										boxShadow:
											"rgba(100, 100, 100, 0.1) 0px 0px 10px 5px",

										color: "rgba(61, 61, 61, 0.6)",
									}}
									onClick={no}
								>
									No
								</div>
							)}
							{yes ? (
								<div
									style={{
										borderRadius: "7px",
										paddingLeft: "25px",
										paddingRight: "25px",
										paddingTop: "10px",
										paddingBottom: "10px",
										cursor: "pointer",
										backgroundColor: "rgb(35,196,144)",
										boxShadow:
											"rgba(35,196,144, 0.2) 0px 0px 10px 5px",

										color: "white",
									}}
									onClick={yes}
								>
									Yes
								</div>
							) : (
								<div
									style={{
										borderRadius: "7px",
										paddingLeft: "30px",
										paddingRight: "30px",
										paddingTop: "10px",
										paddingBottom: "10px",
										cursor: "pointer",
										backgroundColor: "rgb(35,196,144)",
										boxShadow:
											"rgba(35,196,144, 0.2) 0px 0px 10px 5px",

										color: "white",
									}}
									onClick={okay}
								>
									Ok
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
