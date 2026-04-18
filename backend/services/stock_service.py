import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")


def get_stock_price(symbol: str):
    url = "https://www.alphavantage.co/query"
    
    params = {
        "function": "GLOBAL_QUOTE",
        "symbol": symbol,
        "apikey": API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    try:
        quote = data["Global Quote"]
        return {
            "symbol": quote["01. symbol"],
            "price": quote["05. price"],
            "change": quote["09. change"],
        }
    except:
        return {"error": "Invalid symbol or API limit reached"}


def get_stock_history(symbol: str):
    url = "https://www.alphavantage.co/query"
    
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    # 🔥 Handle API limit / failure properly
    if "Time Series (Daily)" not in data:
        print("API ERROR:", data)
        return {"error": "API limit reached. Try again later."}

    time_series = data["Time Series (Daily)"]

    result = []
    for date, values in time_series.items():
        result.append({
            "date": date,
            "close": float(values["4. close"])
        })

    return result[:30]
    