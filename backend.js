export default {
	
	async fetch(request) {
		const apiKey = 'GEMINI_API_KEY'; // Replace with your actual API key
		const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

		// Extract parameters from the URL
		const url = new URL(request.url);
		const word = url.searchParams.get('word');
		const language = url.searchParams.get('language');

		const requestBody = {
			"contents": [
			{
				"parts": [
				{
					"text": `You are an AI designed to translate words from English. Your mission is to translate the provided English word ${word} to it's correspoinding word in the ${language} language. Make sure to provide the exact translation. Generated Tranlated Word: (Print only one word and if there is any other then separate it by commas)\n`
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
		return new Response(JSON.stringify(generatedNames), {
			statusText: "OK",
			headers: {
			  'Content-Type': 'application/json',
			  'Access-Control-Allow-Origin': '*'
			},
		});
	}

};
