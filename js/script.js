// Colors
let emptyColor = "#F5F3BB";
let wallColor = "black";
let startColor = "green";
let endColor = "red";
let neighborColor = "orange";
let openColor = "yellow";

let columns = 50;
let rows = 20;
let grid = new Array(columns);
let brush = 1; // what the mouse does on each cell of the grid, 1 sets start, 2 makes walls, 3 sets end
let start;
let end;
let dragging = false;
let searching = false;
let movingStart = false;
let movingEnd = false;
let displaying = false;
let speedRange = document.getElementById("speed-range");
let speed = speedRange.value;

function resetPath() {
	document.getElementById("search-status").innerHTML = "Draw your map!";
	displaying = false;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			grid[i][j].reset();
		}
	}
}

function calculateAllHs(end) {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			grid[i][j].calculateH(end);
		}
	}
}

function setUp() {
	let canvas = document.getElementById("canvas");
	document.onmouseup = function(e) {
		dragging = false;
		movingStart = false;
		movingEnd = false;
	}
	canvas.style.width = (27*columns).toString(10) + "px";
	for (let i = 0; i < rows; i++) {
		grid[i] = new Array(columns);
		for (let j = 0; j < columns; j++) {
			grid[i][j] = new Cell(i, j);
			let square = document.createElement('div');
			square.className = "square";
			square.id = "square-" + i + "-" + j;
			canvas.appendChild(square);
			square.onmouseover = function(e) {
				if (dragging && !searching) {
					grid[i][j].pressed(false);
				}
			}
			square.onmousedown = function(e) {
				dragging = true;
				if (!searching) {
					grid[i][j].pressed(true);
				}
			}
		}
	}
}

setUp();
start = grid[4][4];
end = grid[15][45];
grid[4][4].makeStart();
grid[15][45].makeEnd();

document.getElementById("run-btn").onclick = function() {
	doAStar(start, end, true);
}

document.getElementById("clear-grid-btn").onclick = function() {
	resetPath();
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (grid[i][j].isWall) {
				grid[i][j].makeEmpty();
			}
		}
	}
}

document.getElementById("clear-path-btn").onclick = resetPath;

speedRange.oninput = function() {
	speed = this.value;
}