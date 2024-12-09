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
            alert(`Gemini API only allows 60 request/minute. Please wait ${remainingSeconds} seconds before generating again.`);
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
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;

    const requestBody = {
        "contents": [
        {
            "parts": [
            {
                "text": `You are an AI designed to translate words. Your mission is to translate the English word ${word} and provide it's translated word in the ${language} language. Generated Word: (Print only word and it there is any other then separate it by commas)\n`
            }
            ]
        }
        ],
        "generationConfig": {
        "temperature": 0.9,
        "topK": 1,
        "topP": 1,
        "maxOutputTokens": 2048,
        "stopSequences": []
        },
        "safetySettings": [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
        ]
    };

    console.log(requestBody.contents[0].parts);
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();
    const generatedNames = responseData.candidates[0].content.parts[0].text.split(',').map(name => name.trim());
    return generatedNames;
}