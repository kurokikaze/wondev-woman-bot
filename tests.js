var printErr = console.log;
import FakeReader from './FakeReader';
import Bot from './Bot';

describe("bot tests", function() {

    beforeEach(function() {
	});

    it('should work with bits', function(){
		expect(Math.pow(2, 2)).toEqual(4); // числа
	});
	
	it ('should apply directions to coordinates', function(){ 
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		const unit = {
			x: 5,
			y: 5
		};
		
		expect(botInstance.getMovedPoint(unit, 'N')).toEqual({ x: 5, y: 4 });
		expect(botInstance.getMovedPoint(unit, 'NE')).toEqual({ x: 6, y: 4 });
		expect(botInstance.getMovedPoint(unit, 'E')).toEqual({x: 6, y: 5});
		expect(botInstance.getMovedPoint(unit, 'SE')).toEqual({x: 6, y: 6});
		expect(botInstance.getMovedPoint(unit, 'S')).toEqual({x: 5, y: 6});
		expect(botInstance.getMovedPoint(unit, 'SW')).toEqual({x: 4, y: 6});
		expect(botInstance.getMovedPoint(unit, 'W')).toEqual({x: 4, y: 5});
		expect(botInstance.getMovedPoint(unit, 'NW')).toEqual({x: 4, y: 4});
	})
	
	it('should sort moves by score', function() {
		const legalMoves = [
			{
				score: 3
			},
			{
				score: 1
			},
			{
				score: 2
			}
		];
		
		const goodSortedMoves = [
			{
				score: 3
			},
			{
				score: 2
			},
			{
				score: 1
			}
		];
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		var sortedMoves = botInstance.sortScores(legalMoves);
		
		expect(sortedMoves).toEqual(goodSortedMoves);
	});
	
	it('should build command from action object', function() {
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		const action = {
			type: 'MOVE&BUILD',
			index: 0,
			dir1: 'N',
			dir2: 'SW'
		}
		
		expect(botInstance.buildCommand(action)).toEqual('MOVE&BUILD 0 N SW');
	});
	
	it('should apply actions to the field', function() {
		const field = [
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];
		
		const unit = {
			x: 2,
			y: 2
		};

		/* N N */
		const moveNbuildN = {
			action: {dir1: 'N', dir2: 'N'},
			result: [
				[0, 0, 1, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]
			]
		}
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.applyAction(field, unit, moveNbuildN.action)).toEqual(moveNbuildN.result);

		/* NW SE */
		const moveNWbuildSE = {
			action: {dir1: 'NW', dir2: 'SE'},
			result: [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 1, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]
			]
		}
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.applyAction(field, unit, moveNWbuildSE.action)).toEqual(moveNWbuildSE.result);

		/* SE SE */
		const moveSEbuildSE = {
			action: {dir1: 'SE', dir2: 'SE'},
			result: [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 1]
			]
		}
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.applyAction(field, unit, moveSEbuildSE.action)).toEqual(moveSEbuildSE.result);
	});
	
	it ('should prioritize taking 3-height points', function() {
		const field = [
			[0, 0, 0, 0, 0],
			[0, 3, 0, 0, 0],
			[0, 0, 2, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		];
		
		const unitMiss = {
			x:2, y: 2
		};

		const unitHit = {
			x:1, y: 1
		};
		
		const enemy = {
			x: 0,
			y: 0
		};
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.getFieldscore(field, enemy, unitMiss)).toEqual(13);
		expect(botInstance.getFieldscore(field, enemy, unitHit)).toEqual(1013);
	});
	
	it ('should prioritize taking 3-height points (integration)', function() {
		const field = [
			[0, 0, 0, 0, 0],
			[0, 3, 0, 0, 0],
			[0, 0, 2, 0, 0],
			[0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0]
		];
		
		const unitStart = {
			x:2, 
			y: 2,
			index: 0,
			mine: true
		};

		const enemy = {
			x: 0,
			y: 0,
			index: 4,
			mine: false
		};
		
		const actionTake = {
			type: 'MOVE&BUILD',
			index: 0,
			dir1: 'NW',
			dir2: 'E'
		};
		
		const actionBuild = {
			type: 'MOVE&BUILD',
			index: 0,
			dir1: 'S',
			dir2: 'SW'
		};
		
		const legalActions = [
			actionBuild,
			actionTake
		];
		
		const units = [
			unitStart,
			enemy
		];

		var reader = new FakeReader({
			rows: field,
			units,
			legalActions			
		});
		
		let command = null;
		var printFunc = function(out) { command = out };
		
		var botInstance = new Bot(reader, printFunc);
		
		botInstance.runCycle();
		
		expect(command).toEqual('MOVE&BUILD 0 NW E');		
	});
	
	it('should discourage locked configurations', function(){
		const field = [
			[0, 0, 0, 0, 0],
			[0, 4, 4, 4, 0],
			[0, 4, 0, 4, 0],
			[0, 4, 4, 4, 0],
			[0, 0, 0, 0, 0]
		];
		
		const unitLocked = {
			x:2, y: 2
		};

		const unitFree = {
			x:0, y: 3
		};
		
		const enemy = {
			x: 0,
			y: 0
		};
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.getFieldscore(field, enemy, unitFree)).toEqual(0);
		expect(botInstance.getFieldscore(field, enemy, unitLocked)).toEqual(-10000);
	});

	it('should understand steep borders as locked configurations', function(){
		const field = [
			[0, 0, 0, 0, 0],
			[2, 0, 3, 4, 3],
			[1, 0, 3, 1, 4],
			[0, 0, 3, 3, 4],
			[2, 0, 0, 0, 0]
		];
		
		const unitLocked = {
			x:3, y: 2
		};

		const unitFree = {
			x:0, y: 3
		};
		
		const enemy = {
			x: 0,
			y: 0
		};
		
		var reader = new FakeReader({});
		
		var botInstance = new Bot(reader);
		
		expect(botInstance.getFieldscore(field, enemy, unitFree)).toEqual(0);
		expect(botInstance.getFieldscore(field, enemy, unitLocked)).toEqual(-9999);
	});
	
});