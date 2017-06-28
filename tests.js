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
		var legalMoves = [{
			score: 3
		},
		{
			score: 1
		},
		{
			score: 2
		}
		];
		
		var goodSortedMoves = [{
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
	
});