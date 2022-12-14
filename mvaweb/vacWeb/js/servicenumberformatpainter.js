const acceptedPatterns = [];
	const userInputPattern = [];

	// grab user's input 
	var input = document.getElementById("serviceNumber").value;

	// define existing formats 
	const sampleDisplay = [{
		"format": "a1234",
		"status": "clean"
	}, {
		"format": "a12345",
		"status": "clean"
	}, {
		"format": "ab12345",
		"status": "clean"
	}, {
		"format": "a12345678",
		"status": "clean"
	}, {
		"format": "1234ab",
		"status": "clean"
	}, {
		"format": "123456789",
		"status": "clean"
	}];

	// when page loads
	document.body.onload = init;

	function init() {
		// draw existing formats
		drawSamples();
		// create character/letter patterns from samples for comparing to input later
		detectAcceptedPatterns();
	}


	document.getElementById("serviceNumber").oninput = function() {
		input = document.getElementById("serviceNumber").value;
		detectUserInputPattern(input);
		compareInputFormat();
		drawSamples();
	};

	// draw existing formats and their 'status'
	function drawSamples() {
		let ul = document.getElementById("sampleList");

		if (!ul) {
			return;
		} 
		
		ul.innerHTML = "";

		var i = 0;

		sampleDisplay.forEach(element => {
			// create a new li element
			const newli = document.createElement("li");
			newli.classList.add("mrgn-rght-xl");
			// create a new span element
			const icon = document.createElement("span");
			icon.classList.add("fa", "fa-li", "mrgn-rght-sm");
			// update status/icon
			if (element.status == "clean") {
				icon.classList.add("fa-genderless", "text-default"); //default
			} else if (element.status == "potential") {
				icon.classList.add("fa-spinner", "text-warning"); //spinner
			} else if (element.status == "match") {
				icon.classList.add("fa-check", "text-success"); //checkmark
			} else if (element.status == "invalid") {
				icon.classList.add("fa-times", "text-danger"); //error
			}

			const newContent = document.createTextNode(element.format);
			// add the icon to the list item
			newli.appendChild(icon);
			// add the text node to the newly created list item
			newli.appendChild(newContent);
			// add the newly created li and its content into the list
			ul.appendChild(newli);

		});

	}

	function detectAcceptedPatterns() {
		sampleDisplay.forEach(sample => {
			const pattern = [];
			var isLetter;
			// go through each character of the sample 
			for (let i = 0; i < sample.format.length; i++) { //length of string
				let char = sample.format.slice(i, i + 1);
				//is this character a letter?  
				if ((/^[A-Za-z]*$/i.test(char))) {
					isLetter = true;
				} else if (/^[0-9]*$/i.test(char)) {
					isLetter = false;
				}
				pattern.push(isLetter);
			}
			//store pattern of isLetter for comparison to input
			acceptedPatterns.push(pattern);
		})
	}

	function detectUserInputPattern(value) {
		const pattern = [];
		// go through each character of the sample 
		for (let i = 0; i < value.length; i++) { //length of string
			//is this character a letter? 	 
			let char = value.slice(i, i + 1);

			if ((/^[A-Za-z]*$/i.test(char))) {
				isLetter = true;
			} else if (/^[0-9]*$/i.test(char)) {
				isLetter = false;
			} else {
				return false;
			}
			pattern.push(isLetter);
		}
		//store each new inputs pattern of isLetter for comparison to samples
		userInputPattern.splice(0, 1, pattern);
	}

	function compareInputFormat() {
		for (let j = 0; j < acceptedPatterns.length; j++) { // for the each of the samples
			sampleDisplay[j].status = "clean"; //reset display of this sample
			for (let k = 0; k < userInputPattern[0].length; k++) { // for each char of the input

				var a = acceptedPatterns[j][k]; //store if sample is a letter
				var b = userInputPattern[0][k]; //store if input char is a letter

				if ((a == false && b == false) || (a == true && b == true)) { //if pattern is matching so far								
					if (userInputPattern[0].length == acceptedPatterns[j].length) { //if the length of the pattern is the same

						console.log("length matches " + input.length);

						if ((!userInputPattern[0][0]) && (userInputPattern[0].length == 9) && (acceptedPatterns[j].length == 9)) {
							//SIN Validation
							//Luhn's algorithm 046454286 <--- A fictitious, but valid SIN
							if (checkLuhn(input)) {
								sampleDisplay[j].status = "match";
							} else if (!checkLuhn(input)) {
								sampleDisplay[j].status = "invalid";
							}
						} else {
							sampleDisplay[j].status = "match";
						}

					} else if (userInputPattern[0].length > acceptedPatterns[j].length) { //if the input is too long
						sampleDisplay[j].status = "invalid";
						break;
					} else if (userInputPattern[0].length < acceptedPatterns[j].length) { //if the input is shorter than the pattern
						sampleDisplay[j].status = "potential";
					}
				} else if ((a == false && b == true) || (a == true && b == false) || (a == null || b == null)) { //if the patterns do not match
					//console.log(a + " " + b + " = invalid");
					sampleDisplay[j].status = "invalid";
					break; //no need to continue through the rest of the input's characters
				}

			}
		}
	}

	// Javascript program to implement Luhn algorithm

	// Returns true if given
	// SIN is valid
	function checkLuhn(cardNo) {
		let nDigits = cardNo.length;

		let nSum = 0;
		let isSecond = false;
		for (let i = nDigits - 1; i >= 0; i--) {

			let d = cardNo[i].charCodeAt() - '0'.charCodeAt();

			if (isSecond == true)
				d = d * 2;

			// We add two digits to handle
			// cases that make two digits
			// after doubling
			nSum += parseInt(d / 10, 10);
			nSum += d % 10;

			isSecond = !isSecond;
		}
		return (nSum % 10 == 0);
	}