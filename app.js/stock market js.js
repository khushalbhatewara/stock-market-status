function fetchStockData() {
    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    
    if (!symbol) {
        alert('Please enter a company symbol!');
        return;
    }
    
    // Use Alpha Vantage API or Yahoo Finance API to get stock data
    const apiKey = 'YOUR_API_KEY';  // You'll need to sign up for an API key
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    
    // Fetch stock data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => processStockData(data, symbol))
        .catch(error => {
            alert('Error fetching stock data. Please try again later.');
            console.error(error);
        });
}

function processStockData(data, symbol) {
    if (data["Error Message"]) {
        alert("Invalid symbol or API limit reached.");
        return;
    }

    const timeSeries = data["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    const closePrice = parseFloat(latestData["4. close"]).toFixed(2);
    const date = latestDate;
    
    // Calculate 50-day SMA and 200-day SMA
    const sma50 = calculateSMA(timeSeries, 50);
    const sma200 = calculateSMA(timeSeries, 200);

    // Determine signal (BUY, SELL, N/A)
    let signal = "N/A";
    if (sma50 > sma200) {
        signal = "BUY";
    } else if (sma50 < sma200) {
        signal = "SELL";
    }

    // Display results
    const stockDataContainer = document.getElementById('stockData');
    stockDataContainer.innerHTML = `
        <p><strong>Company Symbol:</strong> ${symbol}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Close Price:</strong> $${closePrice}</p>
        <p><strong>50-Day SMA:</strong> $${sma50}</p>
        <p><strong>200-Day SMA:</strong> $${sma200}</p>
        <p class="signal"><strong>Signal:</strong> ${signal}</p>
    `;
}

function calculateSMA(timeSeries, days) {
    const dates = Object.keys(timeSeries).slice(0, days);
    const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));

    const sum = prices.reduce((acc, price) => acc + price, 0);
    return (sum / days).toFixed(2);
}
