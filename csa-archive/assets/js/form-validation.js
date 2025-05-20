export function initializeNumberInputRestrictions() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        const maxLength = parseInt(input.getAttribute("maxlength"), 10);

        // Restrict input to numeric characters and enforce max length
        input.addEventListener("input", (event) => {
            const input = event.target;

            // Remove non-numeric characters (including 'e', '.', '-', '+')
            input.value = input.value.replace(/[^0-9]/g, '');

            // Ensure the value doesn't exceed the max length
            if (input.value.length > maxLength) {
                input.value = input.value.slice(0, maxLength);
            }
        });

        // Prevent non-numeric characters from being pasted
        input.addEventListener("paste", (event) => {
            const pasteData = event.clipboardData.getData("text");
            if (!/^\d+$/.test(pasteData)) {
                event.preventDefault();
            }
        });
    });
}
