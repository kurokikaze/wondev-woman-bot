var rows = [];
var printErr = console.log;

describe("bot tests", function() {

    beforeEach(function() {
		//global.rows = [];
		printErr = console.log;
	});

    it('should work with bits', function(){
		expect(Math.pow(2, 2)).toEqual(4); // числа
	};
});