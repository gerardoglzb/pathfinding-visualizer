async function doAStar(s, e, timeBreak) {
	calculateAllHs(end);
	searching = true;
	resetPath();
	let openNodes = [];
	let nodesOnceOpened = [];
	let searchStatus = document.getElementById("search-status");
	searchStatus.style.display = "inline";
	openNodes.push(s);
	nodesOnceOpened.push(s);
	let foundEnding = false;
	while (true) {
		if (openNodes.length == 0) {
			break;
		}
		let current = openNodes[0];
		let leftovers = [];
		for (let i = 1; i < openNodes.length; i++) {
			if (openNodes[i].getF() <= current.getF()) {
				current = openNodes[i];
				leftovers.push(openNodes[i]);
			}
		}
		for (let i = 0; i < leftovers.length; i++) {
			if (leftovers[i].getF() == current.getF() && leftovers[i].h < current.h) {
				current = leftovers[i];
			}
		}

		let currRealIndex = nodesOnceOpened.indexOf(current);
		current = nodesOnceOpened[currRealIndex];
		let currIndex = openNodes.indexOf(current);
		openNodes.splice(currIndex, 1);
		current.evaluate();

		if (current.isEnd) {
			current.colorTo(endColor);
			foundEnding = true;
			break;
		}

		let neighbors = current.getNeighbors();
		for (let i = 0; i < neighbors.length; i++) {
			if (neighbors[i].hasBeenEvaluated || (neighbors[i].isWall && !neighbors[i].isEnd)) {
				continue;
			}
			if (neighbors[i].g - current.g > 1 || !openNodes.includes(neighbors[i])) {
				neighbors[i].g = current.g + 1;
				neighbors[i].parent = current;
				if (!openNodes.includes(neighbors[i])) {
					openNodes.push(neighbors[i]);
					neighbors[i].colorTo(neighborColor);
					nodesOnceOpened.push(neighbors[i]);
				}
			}
		}
		if (timeBreak > 0) {
			await new Promise(r => setTimeout(r, 0));
		}
	}
	if (foundEnding) {
		searchStatus.innerHTML = "Path found";
		let current = e.parent;
		while (!current.isStart) {
			current.colorTo("blue");
			current = current.parent;
			if (timeBreak > 0) {
				await new Promise(r => setTimeout(r, timeBreak));
			}
		}
	} else {
		searchStatus.innerHTML = "Path not found";
	}
	searching = false;
	displaying = true;
}