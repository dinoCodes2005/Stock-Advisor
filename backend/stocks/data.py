import os 
from pathlib import Path
from statistics import covariance
from nselib import capital_market 
import pandas as pd
from IPython.display import display
import io
from pandasgui import show
import numpy as np
from scipy.stats import norm
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split



numeric_cols = ["Open Price", "Close Price", "High Price", "Low Price"]

def get_nifty_50_data(index,from_date,to_date):
    nifty_50_list = capital_market.nifty50_equity_list(index,from_date,to_date)
    return nifty_50_list

#stock return percentage 
def get_stock_return_df(Symbol,from_date,to_date):
    #returns a dataframe conatining the Return %
    data = capital_market.price_volume_and_deliverable_position_data(symbol=Symbol, from_date=from_date, to_date=to_date)
    df = pd.read_csv("file.csv",skipinitialspace=True)
    df.columns = df.columns.str.strip()
    for col in df.columns:
        if df[col].dtype == object:  # Check if the column contains strings
            df[col] = df[col].str.replace(",", "")
    
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors="coerce")
    df["Return %"] = (df["Close Price"]/df["Open Price"] - 1) * 100
    return df

#market return percentage on any index
def get_market_return_df(index,from_date,to_date):
    #this does not generate any csv file instead returns a dataframe
    nifty_50 = capital_market.index_data(index = index,from_date=from_date, to_date=to_date)
    nifty_50["Market Return %"] = (nifty_50["CLOSE_INDEX_VAL"]/nifty_50["OPEN_INDEX_VAL"] - 1) * 100
    return nifty_50

#Calculates Volatility Measurement
def get_std_dev(Symbol,from_date,to_date):
    df = get_stock_return_df(Symbol,from_date,to_date)
    std_dev = df["Return %"].std()
    return std_dev

#beta market sensitivity
def get_market_sensitivity(Symbol,index,from_date,to_date):
    stock_return = get_stock_return_df(Symbol,from_date,to_date)["Return %"]
    market_return = get_market_return_df(index,from_date,to_date)["Market Return %"]
    
    min_length = min(len(stock_return), len(market_return))

    # Truncate both arrays to the same length
    stock_return = stock_return[:min_length]
    market_return = market_return[:min_length]
    
    data = {
        "Stock Return":stock_return,
        "Market Return":market_return,
    }
    #[[0.00143  0.001075]
    #[0.001075 0.00083 ]]
    #cov_matrix[0, 0] → Variance of stock returns = 0.00143
    #cov_matrix[1, 1] → Variance of market returns = 0.00083
    #cov_matrix[0, 1] or cov_matrix[1, 0] → Covariance between stock and market returns = 0.001075
    temp_df = pd.DataFrame(data)
    covariance= temp_df.cov().iloc[0,1]

    var_market = market_return.var(ddof=1)
    beta = covariance / var_market
    return beta

#maximum_drawdown
def maximum_drawdown(Symbol,from_date,to_date):
    data = capital_market.price_volume_and_deliverable_position_data(symbol=Symbol, from_date=from_date, to_date=to_date)
    df = pd.read_csv("file.csv",skipinitialspace=True)
    df.columns = df.columns.str.strip()
    for col in df.columns:
        if df[col].dtype == object:  # Check if the column contains strings
            df[col] = df[col].str.replace(",", "")
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors="coerce")
    stock_prices = df['Close Price']
    rolling_max = stock_prices.cummax()
    drawdown = (stock_prices - rolling_max) / rolling_max
    max_drawdown = drawdown.min()
    return max_drawdown

#Value at Risk
def value_at_risk(Symbol,from_date,to_date):
    df = get_stock_return_df(Symbol,from_date,to_date)
    mean = df["Return %"].mean()
    std_dev = get_std_dev(Symbol,from_date,to_date)
    confidence_level = 0.95
    z_score = norm.ppf(confidence_level)
    vaR = mean - z_score * std_dev
    return vaR

#Sharpe Ratio

def sharpe_ratio(Symbol,from_date,to_date):
    risk_free_rate = 0.05
    df = get_stock_return_df(Symbol,from_date,to_date)
    # Calculate mean return and standard deviation
    mean_return = df['Return %'].mean() * 252  # Annualized return
    std_dev = get_std_dev(Symbol,from_date,to_date)
    # Calculate Sharpe Ratio
    sharpe_ratio = (mean_return - risk_free_rate) / std_dev
    return sharpe_ratio

def calculate_risk_tolerance(Symbol,index,from_date,to_date):
    volatility = get_std_dev(Symbol,from_date,to_date)
    beta = get_market_sensitivity(Symbol,index,from_date,to_date)
    max_drawdown = maximum_drawdown(Symbol,from_date,to_date)
    vaR = value_at_risk(Symbol,from_date,to_date)
    sR = sharpe_ratio(Symbol,from_date,to_date)
    
    w_volatility = 0.25
    w_beta = 0.20
    w_drawdown = -0.20
    w_var = -0.25
    w_sharpe = 0.30
    
    risk_tolerance_score = (
        w_volatility * volatility +
        w_beta * beta +
        w_drawdown * max_drawdown +
        w_var * vaR +
        w_sharpe * sR
    )
    
    
    return risk_tolerance_score





# print(get_market_sensitivity("ADANIENT","NIFTY 50","20-06-2023", "28-03-2025"))
# show(get_market_return_df("NIFTY 50","28-03-2024", "28-03-2025"))
# print(get_market_sensitivity("HDFCBANK","NIFTY 50","26-03-2024","26-03-2025"))
# print(maximum_drawdown("HDFCBANK","28-03-2024", "28-03-2025"))
# show(get_stock_return_df("HDFCBANK","28-03-2024", "28-03-2025"))
print(calculate_risk_tolerance("RELIANCE","NIFTY 50","26-03-2024","26-03-2025"))







# nifty_std_dev = []
# for company in nifty_companies:
#     nifty_std_dev.append(get_std_dev(company))
    
# print(nifty_std_dev)


# show(df)

