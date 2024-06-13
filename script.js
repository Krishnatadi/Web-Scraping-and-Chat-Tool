let scrapedContent = '';

document.getElementById('scrapeButton').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value.trim();
    const selector = document.getElementById('selectorInput').value.trim();
    const outputText = document.getElementById('outputText');
    const loadingMessage = document.getElementById('loadingMessage');
    const scrapedContentHeader = document.getElementById('scrapedContentHeader');
    const errorMessage = document.getElementById('errorMessage');
    // Regular expression to match valid URL format
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    if (!url) {
        errorMessage.textContent = 'Please enter a URL.';
        errorMessage.style.display = 'block';
        return;
    } else if (!url.match(urlRegex)) {
        errorMessage.textContent = 'Please enter a valid URL.';
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }
    outputText.textContent = '';
    loadingMessage.style.display = 'block';
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            loadingMessage.style.display = 'none';
            if (data.contents) {
                scrapedContentHeader.style.display = 'block';
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                if (selector) {
                    const selectedElements = doc.querySelectorAll(selector);
                    if (selectedElements.length) {
                        scrapedContent = '';
                        selectedElements.forEach(el => {
                            scrapedContent += el.outerHTML + '\n\n'; // Extract HTML content
                        });
                        outputText.textContent = scrapedContent;
                    } else {
                        scrapedContent = 'No elements found with the given selector.';
                        outputText.textContent = scrapedContent;
                    }
                } else {
                    scrapedContent = data.contents;
                    outputText.textContent = scrapedContent;
                }
                document.getElementById('outputContainer').style.display = 'block';
            } else {
                errorMessage.textContent = 'Error: No content found in the response.';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            loadingMessage.style.display = 'none';
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = 'block';
        });
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('urlInput').value = '';
    document.getElementById('selectorInput').value = '';
    document.getElementById('outputText').textContent = '';
    scrapedContent = '';
    document.getElementById('scrapedContentHeader').style.display = 'none';
    document.getElementById('outputContainer').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
});

document.getElementById('copyButton').addEventListener('click', function() {
    const outputText = document.getElementById('outputText');
    if (outputText.textContent.trim()) {
        navigator.clipboard.writeText(outputText.textContent)
            .then(() => {
                alert('Content copied to clipboard!');
            })
            .catch(error => {
                console.error('Unable to copy content: ', error);
            });
    }
});