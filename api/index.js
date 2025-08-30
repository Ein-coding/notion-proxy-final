// 引入需要的套件
const express = require('express');
const axios = require('axios');

// 建立 Express 應用程式
const app = express();

// 定義主路由
app.get('*', async (req, res) => {
    try {
        // 動態載入 opencc-js
        const { Converter } = await import('opencc-js');
        const converter = Converter({ from: 'cn', to: 'tw' });

        const targetUrl = 'https://rili-d.jin10.com/open.php?fontSize=14px&scrolling=yes&theme=primary';

        // 【*** 這裡就是修改的地方 ***】
        // 設定請求標頭，偽裝成瀏覽器
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        // 發送請求時帶上新的標頭
        const response = await axios.get(targetUrl, {
            headers: headers,
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