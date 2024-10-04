const analyzeText = async () => {
    const inputText = document.getElementById('input-text').value;
    if (!inputText) {
        alert('Please enter some text to analyze.');
        return;
    }

    // Show a loading message
    document.getElementById('insights').innerHTML = 'Analyzing...';
    document.getElementById('prompts').innerHTML = '';

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', // Your Hugging Face API key
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `Analyze this personal narrative: "${inputText}" and provide insights and creative writing prompts.`
            })
        });

        // Check if the response is okay (status 200-299), otherwise throw an error
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error Details:', errorDetails);
            throw new Error(`API returned error with status ${response.status}: ${errorDetails.error || errorDetails}`);
        }

        const data = await response.json();

        // Check if the expected fields are present in the response
        if (!data || !data.generated_text) {
            throw new Error("Unexpected API response format.");
        }

        const result = data.generated_text;

        // Display the result
        document.getElementById('insights').innerText = "Insights: " + extractInsights(result);
        document.getElementById('prompts').innerText = "Creative Prompts: " + extractPrompts(result);

    } catch (error) {
        console.error('Error:', error); // This will print the full error to the console
        document.getElementById('insights').innerText = `Error analyzing the text: ${error.message}`;
    }
};

// Helper functions to extract insights and prompts
const extractInsights = (text) => {
    const insightsRegex = /Insights:(.*)Prompts:/s;
    const insightsMatch = text.match(insightsRegex);
    return insightsMatch ? insightsMatch[1].trim() : 'No insights found.';
};

const extractPrompts = (text) => {
    const promptsRegex = /Prompts:(.*)/s;
    const promptsMatch = text.match(promptsRegex);
    return promptsMatch ? promptsMatch[1].trim() : 'No prompts found.';
};
