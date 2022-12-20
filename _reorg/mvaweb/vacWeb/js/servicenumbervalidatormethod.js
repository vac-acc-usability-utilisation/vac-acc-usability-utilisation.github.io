$( document ).on( "wb-ready.wb", function( event ) {
		if(jQuery.validator && jQuery.validator !== 'undefined') {
                    
            $.validator.addMethod("serviceNumber", function(value, element) {
        //
        if (this.optional(element)) {
            return true;
        }

        // define existing formats 
        var validSamples = [
            { "format": "a1234" },
            { "format": "a12345" },
            { "format": "ab12345" },
            { "format": "a12345678" },
            { "format": "1234ab" },
            { "format": "123456789" }
        ];

        const samplePatterns = [];
        validSamples.forEach(sample => {
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
            samplePatterns.push(pattern);
        });


        const inputPattern = [];
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
        inputPattern.splice(0, 1, pattern);

        for (let i = 0; i < samplePatterns.length; i++) {

            if (samplePatterns[i].length == inputPattern[0].length) {
                var countMatches = 0
                for (let n = 0; n < inputPattern[0].length; n++) {
                    var a = samplePatterns[i][n];
                    var b = inputPattern[0][n];
                    if (a == b) {
                        countMatches += 1
                    }
                }
                if (countMatches == inputPattern[0].length) {

                    if (value.length == 9 && (!inputPattern[0][0])) {

                        var nCheck = 0,
                            nDigit = 0,
                            bEven = false,
                            n, cDigit;

                        value = value.replace(/\D/g, "");

                        for (n = value.length - 1; n >= 0; n--) {
                            cDigit = value.charAt(n);
                            nDigit = parseInt(cDigit, 10);
                            if (bEven) {
                                if ((nDigit *= 2) > 9) {
                                    nDigit -= 9;
                                }
                            }

                            nCheck += nDigit;
                            bEven = !bEven;
                        }

                        return (nCheck % 10) === 0;

                    } else {
                        return true;
                    }
                }
            } else if (samplePatterns[i].length < inputPattern[0].length) {}
        }

    }, "Not a valid service number format.");

		
		}
	});