/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

class Bot {
	constructor(reader, outFunc, logFunc) {
		this.reader = reader;
		this.data = null;
		
		this.print = outFunc ? outFunc : function(){};
		this.log = logFunc ? logFunc : function(){};
	}
	
	buildCommand(action) {
		return action.type + ' ' + action.index + ' ' + action.dir1 + ' ' + action.dir2;
	}
	
	distance(obj1, obj2) { 
		return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)) 
	}
	
	getFieldscore(field, enemy, me) {
		let score = 0;
		
		let locked = true,
			height1;
			
		let myHeight = field[me.y][me.x];
		
		score += Math.pow(myHeight, 2)
		
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1 ;j++) {
				if (field[me.y + i] && ( field[me.y + i][me.x + j] || field[me.y + i][me.x + j] === 0)) {
					height1 = field[me.y + i][me.x + j];
				} else {
					height1 = 4;
				}

		
				if (Math.abs(height1 - myHeight) <= 1 && i !== 0 && j !== 0) {
					locked = false;
					score += Math.pow(height1, 2);
				}
					
			}
		}

		if (field[me.y][me.x] === 3) {			
			score += 1000;
		}

		if (locked) {
			score -= 10000;
		}

		return score;
	}
	
	sortScores(actions) {
		return actions.sort((a, b) => { 
			if (a.score > b.score) {
				return -1;
			} else if (a.score < b.score) {
				return 1;
			} else { return 0; } })
	}
	
	sortActions(actions) {
		let applier = (action) => {
			let me = this.data.units.filter(e => e.mine)[0];
			action.result = this.applyAction(this.data.rows, me, action);
			
			return action;
		};
		
		let analyzer = (action) => {
			let me = this.data.units.filter(e => e.mine)[0];
			let enemy = this.data.units.filter(e => !e.mine)[0];
			let newMePosition = this.getMovedPoint(me, action.dir1);
			
			action.score = this.getFieldscore(action.result, enemy, newMePosition);
			return action;
		};
		
		let analyzedActions = actions.map(applier).map(analyzer);
		
		let sortedActions = this.sortScores(analyzedActions);
		return sortedActions;
	}
	
	getMovedPoint(unit, direction) {
		let point = { x: unit.x, y: unit.y };
		if (typeof direction === 'string' && direction.length > 0) {
			if (direction.indexOf('N') > -1) { point.y-- }
			if (direction.indexOf('S') > -1) { point.y++ }
			if (direction.indexOf('W') > -1) { point.x-- }
			if (direction.indexOf('E') > -1) { point.x++ }
		}
		
		return point;
	}
	
	applyAction(field, me, action) {
		let newField = JSON.parse(JSON.stringify(field));
		let newMe = this.getMovedPoint(me, action.dir1);

		let target = this.getMovedPoint(newMe, action.dir2);
		
		newField[target.y][target.x]++;
		
		return newField;
	}
	
	giveCommand(command) {
		this.print(command);
	}
	
	runCycle() {
		this.data = this.reader.readData();
		this.log(JSON.stringify(this.data.legalActions));
		
		let rangedActions = this.sortActions(this.data.legalActions);
		
		this.giveCommand(this.buildCommand(rangedActions[0]));
	}
}

export default Bot;