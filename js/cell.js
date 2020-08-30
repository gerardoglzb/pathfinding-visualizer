function Cell(x, y) {
	this.f = 0;
	this.g = 0;
	this.h = 0;
	this.x = x;
	this.y = y;
	this.hasBeenEvaluated = false;
	this.isWall = false;
	this.isStart = false;
	this.isEnd = false;
	this.parent = null;
	this.colorTo = function(color) {
		document.getElementById("square-" + this.x + "-" + this.y).style.backgroundColor = color;
	}
}

Cell.prototype.reset = function() {
	this.hasBeenEvaluated = false;
	this.parent = null;
	if (this.isStart) {
		this.colorTo(startColor);
	} else if (this.isEnd) {
		this.colorTo(endColor);
	} else if (this.isWall) {
		this.colorTo(wallColor);
	} else {
		this.colorTo(emptyColor);
	}
}

Cell.prototype.makeStart = function() {
	this.isStart = true;
	this.colorTo(startColor);
}

Cell.prototype.makeEnd = function() {
	this.isEnd = true;
	this.colorTo(endColor);
}

Cell.prototype.makeWall = function() {
	this.isWall = true;
	this.colorTo(wallColor);
}

Cell.prototype.makeEmpty = function() {
	this.isWall = false;
	this.colorTo(emptyColor);
}

Cell.prototype.backToNormal = function() {
	if (this.isWall) {
		this.colorTo(wallColor);
	} else {
		this.colorTo(emptyColor);
	}
}

Cell.prototype.unmakeStart = function() {
	this.isStart = false;
	this.backToNormal();
}

Cell.prototype.unmakeEnd = function() {
	this.isEnd = false;
	this.backToNormal();
}

Cell.prototype.getNeighbors = function() {
	let neighbors = [];
	for (let i = -1; i <= 1; i+=2) {
		if ((this.x + i) < rows && (this.x + i) >= 0) {
			neighbors.push(grid[this.x+i][this.y]);
		}
		if ((this.y + i) < columns && (this.y + i) >= 0) {
			neighbors.push(grid[this.x][this.y+i]);
		}
	}
	return neighbors;
}

Cell.prototype.getLocation = function() {
	return [this.x, this.y]
}

Cell.prototype.pressed = function(truePressed) {
	if (!truePressed) {
		if (movingStart && !this.isEnd) {
			start.unmakeStart();
			start = grid[this.x][this.y];
			start.makeStart();
			if (displaying) {
				doAStar(start, end, 0);
			}
			return;
		} else if (movingEnd && !this.isStart) {
			end.unmakeEnd();
			end = grid[this.x][this.y];
			end.makeEnd();
			if (displaying) {
				doAStar(start, end, 0);
			}
			return;
		}
	}
	if (truePressed && this.isStart) {
		movingStart = true;
	} else if (truePressed && this.isEnd) {
		movingEnd = true;
	} else if (!this.isStart && !this.isEnd) {
		if (this.isWall) {
			this.makeEmpty();
		} else {
			this.makeWall();
		}
	}
}

Cell.prototype.evaluate = function() {
	this.hasBeenEvaluated = true;
	if (this != start && this != end) {
		this.colorTo(openColor);
	}
}

Cell.prototype.getF = function() {
	return this.g + this.h;
}

Cell.prototype.calculateH = function(end) {
	this.h = Math.abs(end.x - this.x) + Math.abs(end.y - this.y);
}