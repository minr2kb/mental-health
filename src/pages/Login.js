import React from "react";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from "firebase/auth";
import { provider } from "./firebase";

const Login = () => {
	const auth = getAuth();
	const logIn = () => {
		signInWithPopup(auth, provider)
			.then(result => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				// ...
				console.log(token);
				console.log(user);
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
	};

	const logOut = () => {
		// const auth = getAuth();
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log("Sign-out successful");
			})
			.catch(error => {
				// An error happened.
			});
	};

	return (
		<div>
			{/* <input type="email" />
			<input /> */}
			<button onClick={logIn}>Log In</button>
			<button onClick={logOut}>Log Out</button>
			<button
				onClick={() => {
					console.log(auth);
				}}
			>
				Info
			</button>
		</div>
	);
};

export default Login;
