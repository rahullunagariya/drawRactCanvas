import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from './history';
import DrawRect from './Components/DrawObject/drawRect';

const CustomesRoutes = () => (
	<Router history={history}>
		<div>
			<Switch>
				<Route exact path="/" component={DrawRect} />
			</Switch>
		</div>
	</Router>
);

export default CustomesRoutes;
