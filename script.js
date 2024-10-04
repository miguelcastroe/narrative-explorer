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
        const response = await fetch('https://api.cohere.ai/generate', {
            method: 'POST',
            headers: {
                'Authorization': 'd1eFNqcaFF9fLJLceZoqMfDx6lNvKOfVXrlkLsUN',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'command-xlarge-nightly',
                prompt: `Analyze this personal narrative: "${inputText}" and provide insights and creative writing prompts.`,
                max_tokens: 300,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const result = data.generations[0].text;

        // Display the result
        document.getElementById('insights').innerText = "Insights: " + extractInsights(result);
        document.getElementById('prompts').innerText = "Creative Prompts: " + extractPrompts(result);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('insights').innerText = 'Error analyzing the text.';
    }
};

// Helper functions to extract insights and prompts
const extractInsights = (text) => {
    // This is a simple example; you may enhance the extraction process
    const insightsRegex = /Insights:(.*)Prompts:/s;
    const insightsMatch = text.match(insightsRegex);
    return insightsMatch ? insightsMatch[1].trim() : 'No insights found.';
};

const extractPrompts = (text) => {
    const promptsRegex = /Prompts:(.*)/s;
    const promptsMatch = text.match(promptsRegex);
    return promptsMatch ? promptsMatch[1].trim() : 'No prompts found.';
};
