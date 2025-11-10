import React, { useState, useEffect } from 'react';
import { ArrowDownUp } from 'lucide-react';
import './App.css';

const CurrencySwap = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data = await response.json();
        
        const currencyMap = {};
        data.forEach(item => {
          if (item.currency && item.price) {
            const key = item.currency;
            if (!currencyMap[key] || item.date > currencyMap[key].date) {
              currencyMap[key] = {
                currency: item.currency,
                price: parseFloat(item.price),
                date: item.date
              };
            }
          }
        });
        
        const uniqueCurrencies = Object.values(currencyMap);
        setCurrencies(uniqueCurrencies);
        
        if (uniqueCurrencies.length > 0) {
          setFromCurrency(uniqueCurrencies[0].currency);
          setToCurrency(uniqueCurrencies[1]?.currency || uniqueCurrencies[0].currency);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    if (fromAmount && fromCurrency && toCurrency) {
      const fromPrice = currencies.find(c => c.currency === fromCurrency)?.price || 0;
      const toPrice = currencies.find(c => c.currency === toCurrency)?.price || 0;
      
      if (fromPrice && toPrice) {
        const result = (parseFloat(fromAmount) * fromPrice) / toPrice;
        setToAmount(result.toFixed(6));
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, currencies]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getIconUrl = (currency) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Currency Swap
          </h1>
          <p className="text-gray-600">
            Chuyển đổi tiền tệ nhanh chóng và dễ dàng
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Từ
            </label>
            <div className="relative">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="text-black w-full px-4 py-4 pr-32 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.currency} value={curr.currency}>
                    {curr.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 px-2">
              <img
                src={getIconUrl(fromCurrency)}
                alt={fromCurrency}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/24';
                }}
              />
              <span className="text-sm text-gray-500">
                Giá: ${currencies.find(c => c.currency === fromCurrency)?.price.toFixed(4) || '0'}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <ArrowDownUp className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Đến
            </label>
            <div className="relative">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.00"
                className="text-black w-full px-4 py-4 pr-32 text-2xl font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                readOnly
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.currency} value={curr.currency}>
                    {curr.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 px-2">
              <img
                src={getIconUrl(toCurrency)}
                alt={toCurrency}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/24';
                }}
              />
              <span className="text-sm text-gray-500">
                Giá: ${currencies.find(c => c.currency === toCurrency)?.price.toFixed(4) || '0'}
              </span>
            </div>
          </div>

          {fromAmount && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-gray-600">
                Tỷ giá chuyển đổi
              </div>
              <div className="text-lg font-semibold text-gray-800 mt-1">
                1 {fromCurrency} ≈ {
                  (currencies.find(c => c.currency === toCurrency)?.price / 
                   currencies.find(c => c.currency === fromCurrency)?.price).toFixed(6)
                } {toCurrency}
              </div>
            </div>
          )}

          <button className="w-full py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg">
            Thực hiện Swap
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="mt-1">Tổng số currencies: {currencies.length}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrencySwap;
