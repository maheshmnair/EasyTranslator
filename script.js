const generateButton = document.querySelector('#generateButton');
const resultsContainer = document.querySelector('#results-container');
const namesContainer = document.querySelector('#generated-words');
let lastButtonClickTime = 0;
const cooldownTime = 10000;
generateButton.addEventListener('click', async () => {
    const currentTime = Date.now();

    const word = document.querySelector('#word').value;
    const language = document.querySelector('#language').value;


    try {
        const timeElapsedSinceLastClick = currentTime - lastButtonClickTime;
        const remainingTime = cooldownTime - timeElapsedSinceLastClick;

        if (remainingTime > 0) {
            const remainingSeconds = Math.ceil(remainingTime / 1000);
            alert(`Sorry, the AI only allows only 60 requests in a minute. Please wait for ${remainingSeconds} more seconds before generating again.`);
            return;
        }

        generateButton.textContent = 'Gemini AI is doing the Magic!';

        const names = await generateWords(word, language);

        // Clears previously populated results
        namesContainer.innerHTML = ''; 

        names.forEach(name => {
            const nameButton = document.createElement('button');
            nameButton.textContent = name;
            nameButton.classList.add('generated-words-button');
            namesContainer.appendChild(nameButton);
        });

        lastButtonClickTime = currentTime;

        // Show the results container
        resultsContainer.style.display = 'block';
    } catch (error) {
        console.error('Error fetching words:', error);
    } finally {
        generateButton.textContent = 'Generate';
    }
});
    
async function generateWords(word, language) {
    const apiUrl = `https://backend.aint-mj.workers.dev/?word=${word}&language=${language}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data || [];
}
