class Reader {
	
	readConfig() {
		this.size = parseInt(readline());
		this.unitsPerPlayer = parseInt(readline());
	}
	
	toInt (i) { 
		return parseInt(i, 10); 
	} 
	
	readData () {
		let data = {};
		data.rows = new Array(this.size);
		data.units = [];
		data.legalActions = [];
		var inputs, unitX, unitY;		
		
		for (var i = 0; i < this.size; i++) {
			var row = readline();
			data.rows[i] = row.replace(/\./g, '4').split('').map(this.toInt);
		}

		for (var j = 0; j < this.unitsPerPlayer; j++) {
			inputs = readline().split(' ');
			unitX = parseInt(inputs[0]);
			unitY = parseInt(inputs[1]);
			data.units.push({
				x: unitX,
				y: unitY,
				mine: true
			});
		}

		for (var k = 0; k < this.unitsPerPlayer; k++) {
			inputs = readline().split(' ');
			unitX = parseInt(inputs[0]);
			unitY = parseInt(inputs[1]);
			data.units.push({
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
			data.legalActions.push({
				type: atype,
				index: index,
				dir1: dir1,
				dir2: dir2
			});
		}
		
		return data;
	}
}

export default Reader;