/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var size = parseInt(readline());
var unitsPerPlayer = parseInt(readline());

let rows = new Array(size);
let units = [];
let legalActions = [];

var toInt = i => parseInt(i, 10);

var readData = () => {
    rows = new Array(size);
    units = [];
    legalActions = [];
    var inputs, unitX, unitY;
    
    
    for (var i = 0; i < size; i++) {
        var row = readline();
        rows[i] = row.replace(/\./g, '4').split('').map(toInt);
    }

    for (var j = 0; j < unitsPerPlayer; j++) {
        inputs = readline().split(' ');
        unitX = parseInt(inputs[0]);
        unitY = parseInt(inputs[1]);
        units.push({
            x: unitX,
            y: unitY,
            mine: true
        });
    }

    for (var k = 0; k < unitsPerPlayer; k++) {
        inputs = readline().split(' ');
        unitX = parseInt(inputs[0]);
        unitY = parseInt(inputs[1]);
        units.push({
            x: unitX,
            y: unitY,
            mine: false
        });
    }

    var numOfLegalActions = parseInt(readline());
    for (var l = 0; l < numOfLegalActions; l++) {
        inputs = readline().split(' ');
        var atype = inputs[0];
        var index = parseInt(inputs[1]);
        var dir1 = inputs[2];
        var dir2 = inputs[3];
        legalActions.push({
            type: atype,
            index: index,
            dir1: dir1,
            dir2: dir2
        });
    }
};

let distance = (obj1, obj2) => { return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)) };

let buildCommand = (action) => {
    return action.type + ' ' + action.index + ' ' + action.dir1 + ' ' + action.dir2;
};

let getFieldscore = (field, enemy, me) => {
    let score = 0;
    
    let locked = true;
    
    for (i = -1; i <= 1; i++) {
    	for (j = -1; j <= 1 ;j++) {
    		if (field[me.y + i] && ( field[me.y + i][me.x + j] || field[me.y + i][me.x + j] === 0)) {
    			height1 = field[me.y + i][me.x + j];
    		} else {
    			height1 = 4;
    		}

    
    		if (height1 <= 3 && height1 >= 0 && i !== 0 && j !== 0) {
    			locked = false;
    			score += Math.pow(height1, 2);
    		}
    			
    	}
    }

    if (field[me.y][me.x] === 3) {
        score += 1000;
    }

    //score -= Math.pow(distance(me, enemy), 2);
    
    if (locked) {
        score -= 10000;
        printErr('Locked conf');
        printErr(JSON.stringify(field), JSON.stringify(me));
    }

    if (field[me.y][me.x] === 3) {
        printErr(JSON.stringify(field), JSON.stringify(me));
        printErr('Scoring conf, score: ' + score);
    }
        
    return score;
};

let sortActions = (actions) => {
    let applier = (action) => {
        let me = units.filter(e => e.mine)[0];
        action.result = applyAction(rows, me, action);
        
        return action;
    };
    
    let analyzer = (action) => {
        let me = units.filter(e => e.mine)[0];
        let enemy = units.filter(e => !e.mine)[0];
		let newMePosition = getMovedPoint(me, action.dir1);
		
        action.score = getFieldscore(action.result, enemy, newMePosition);
        return action;
    };
    
    return (actions.map(applier).map(analyzer).sort((a, b) => { 
        if (a.score > b.score) {
            return -1;
        } else if (a.score < b.score) {
            return 1;
        } else { return 0; } }));
};

let getMovedPoint = (unit, direction) => {
	let point = { x: unit.x, y: unit.y };
    if (direction.includes('N')) { point.y-- }
    if (direction.includes('S')) { point.y++ }
    if (direction.includes('W')) { point.x-- }
    if (direction.includes('E')) { point.x++ }
	
	return point;
};

let applyAction = (field, me, action) => {
	let newField = Object.assign([], field);
    me = getMovedPoint(me, action.dir1);

    let target = {x: me.x, y: me.y};
    target = getMovedPoint(target, action.dir2);
    
    newField[target.y][target.x]++;
    
    return newField;
};

// game loop
let rowsReported = false;

while (true) {
    readData();
    
    if (!rowsReported) {
        rowsReported = true;
    }
    
    let rangedActions = sortActions(legalActions);
    
    print(buildCommand(rangedActions[0]));
}