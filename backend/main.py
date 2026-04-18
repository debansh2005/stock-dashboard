from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.stock_service import get_stock_price, get_stock_history

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Stock Dashboard API running"}

@app.get("/stock/{symbol}")
def stock(symbol: str):
    return get_stock_price(symbol)

@app.get("/history/{symbol}")
def history(symbol: str):
    return get_stock_history(symbol)