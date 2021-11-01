import {
	Route,
	Redirect,
	Switch,
	BrowserRouter as Router,
} from "react-router-dom";

import Main from "./pages/Main";
import Write from "./pages/Write";
import Login from "./pages/Login";
import Read from "./pages/Read";
import Edit from "./pages/Edit";
import "./App.css";
import React from "react";

const NoMatch = ({ location }) => (
	<div>
		<strong>Error!</strong> No route found matching:
		<div>
			<code>{location.pathname}</code>
		</div>
	</div>
);

function App() {
	return (
		<Router>
			<div className="App">
				<Switch>
					{/*Note that React Router matches any path that starts with the given path,
               which is different behavior than the Express routes that by default looks
               for exact matches. */}
					<Route exact path="/posts" component={Main} />
					<Route exact path="/posts/:id" component={Read} />
					<Route exact path="/write" component={Write} />
					<Route path="/write/:id" component={Edit} />
					<Route
						exact
						path="/"
						render={() => <Redirect to="/posts" />}
					/>
					<Route component={NoMatch} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
