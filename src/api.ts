const BASE_URL = `https://api.coinpaprika.com/v1`

export function fetchCoins() {
    return fetch(`${BASE_URL}/coins`)
    .then(response => 
        response.json()
    );
}

export function fetchCoinInfo(coinId: string) {
    return fetch(`${BASE_URL}/coins/${coinId}`)
    .then(response => 
        response.json()
    );
}

export function fetchCoinTickers(coinId: string) {
    return fetch(`${BASE_URL}/tickers/${coinId}`)
    .then(response => 
        response.json()
    );
}

export function fetchCoinHistory(coinId: string) {
    const endDate = Math.floor(Date.now() / 1000);   // floor는 소수점 내림. ceil는 소수점 올림.
    const startDate = endDate - 60*60*24*7*2;   // 위에서 계산한 시간에서 이주일을 뺌
    return fetch(`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`)
    .then(response => 
        response.json()
    );
}