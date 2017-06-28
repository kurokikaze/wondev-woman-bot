class FakeReader {	
	constructor(data) {
		this.fakeData = data;
	}
	
	readConfig() {
		// Nothing
	}
	
	readData() {
		return this.fakeData;
	}
}

export default FakeReader;