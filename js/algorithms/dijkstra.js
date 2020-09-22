async function doDijkstra(s, e, wait) {
	searching = true;
	resetPath();
	let visitedNodesCount = 0;
	document.getElementById("search-status").innerHTML = "Searching...";
	let current = s;
	current.smallestCost = 0;
	let foundEnding = false;
	let nodesOnceUnexplored = [];
	let unexploredCalculatedNodes = [];
	unexploredCalculatedNodes.push(s);
	nodesOnceUnexplored.push(s);
	while (visitedNodesCount <= nodesCount) {
		if (unexploredCalculatedNodes.length == 0) {
			break;
		}
		let current = null;
		let currIndex;
		for (let i = 0; i < unexploredCalculatedNodes.length; i++) {
			if (current == null || unexploredCalculatedNodes[i].smallestCost < current.smallestCost) {
				current = unexploredCalculatedNodes[i];
				currIndex = i;
			}
		}
		let currRealIndex = nodesOnceUnexplored.indexOf(current);
		current = nodesOnceUnexplored[currRealIndex];
		unexploredCalculatedNodes.splice(currIndex, 1);
		visitedNodesCount++;
		if (current.isEnd) {
			current.colorTo(endColor);
			foundEnding = true;
			break;
		}
		if (!current.isStart) {
			current.colorTo(openColor);
		}
		let neighbors = current.getNeighbors();
		for (let i = 0; i < neighbors.length; i++) {
			if ((neighbors[i].isWall && !neighbors[i].isEnd)) {
				continue;
			}
			if (neighbors[i].smallestCost == null) {
				neighbors[i].smallestCost = current.smallestCost + 1; // in this grid, distance between nodes is always 1
				neighbors[i].parent = current;
				unexploredCalculatedNodes.push(neighbors[i]);
				nodesOnceUnexplored.push(neighbors[i]);
				neighbors[i].colorTo(neighborColor);
			} else {
				if (current.smallestCost + 1 < neighbors[i].smallestCost) {
					neighbors[i].smallestCost = current.smallestCost + 1;
					neighbors[i].parent = current;
				}
			}
		}
		if (wait) {
			await new Promise(r => setTimeout(r, speed));
		}
	}
	let reportStatus;
	let reportLength = 1;
	if (foundEnding) {
		reportStatus = "Path found.";
		let current = e.parent;
		while (!current.isStart) {
			reportLength++;
			current.colorTo("blue");
			current = current.parent;
			if (wait) {
				await new Promise(r => setTimeout(r, speed));
			}
		}
	} else {
		reportStatus = "Path not found.";
		reportLength = 0;
	}
	reportData(reportStatus, reportLength, nodesOnceUnexplored.length);
	searching = false;
	displaying = true;
}
