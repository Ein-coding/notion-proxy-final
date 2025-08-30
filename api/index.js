// 引入需要的套件
const express = require('express');
const axios = require('axios');

// 建立 Express 應用程式
const app = express();

// 定義主路由，這是一個異步函數
app.get('*', async (req, res) => {
    try {
        // 動態載入 opencc-js 套件
        const { Converter } = await import('opencc-js');

        // 建立轉換器：'cn' 到 'tw' (簡體到臺灣正體)
        const converter = Converter({ from: 'cn', to: 'tw' });

        // 目標網站的 URL (專為嵌入設計的乾淨版本)
        const targetUrl = 'https://rili-d.jin10.com/open.php?fontSize=14px&scrolling=yes&theme=primary';

        // 抓取原始網頁內容
        const response = await axios.get(targetUrl, {
            responseType: 'text',
        });
        const originalHtml = response.data;

        // 進行簡轉繁轉換
        const convertedHtml = await converter(originalHtml);

        // 回傳轉換後的 HTML
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(convertedHtml);

    } catch (error) {
        console.error('Error in proxy server:', error);
        res.status(500).send('代理伺服器發生錯誤');
    }
});

// 匯出 app 讓 Vercel 使用
module.exports = app;