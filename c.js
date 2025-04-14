 // DOM Elements
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKey = document.getElementById("shift-input");
const copyBtn = document.getElementById("copy-btn");
const errorMessage = document.getElementById("error-message");

// Update headings and reset fields on encode/decode toggle
selectEncodeOrDecode.forEach((option) => {
    option.addEventListener("click", () => {
        const isEncode = option.value === "encode";
        hInput.textContent = isEncode ? "Plaintext" : "Ciphertext";
        hOutput.textContent = isEncode ? "Ciphertext" : "Plaintext";
        inputText.value = "";
        outputText.value = "";
        hideError();
    });
});

// Handle form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = inputText.value.trim();
    const shift = parseInt(shiftKey.value, 10);
    const selectedOption = Array.from(selectEncodeOrDecode).find(opt => opt.checked);

    if (!text) return showError("Please enter a message.");
    if (isNaN(shift) || shift < 0 || shift > 25) return showError("Shift must be a number between 0 and 25.");
    if (!selectedOption) return showError("Please select encode or decode.");

    const result = caesarCipher(selectedOption.value, text, shift);
    outputText.value = result;
    hideError();
});

// Caesar Cipher logic
function caesarCipher(mode, text, shift) {
    if (mode === "decode") shift = (26 - shift) % 26;

    return [...text].map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const base = char === char.toUpperCase() ? 65 : 97;
            return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
        } else if (/\d/.test(char)) {
            return String.fromCharCode((char.charCodeAt(0) - 48 + shift) % 10 + 48);
        }
        return char;
    }).join('');
}

// Copy result to clipboard
copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(outputText.value);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
    } catch (err) {
        showError("Failed to copy text.");
    }
});

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.style.display = "none";
}
