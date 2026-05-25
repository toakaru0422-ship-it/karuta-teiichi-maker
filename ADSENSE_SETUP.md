# Google AdSense 設定メモ

## 1. 差し替えるもの

`src/App.jsx` の上部にある以下を本番用に差し替えてください。

```js
const SITE_URL = "https://example.com";
const CONTACT_EMAIL = "xxxxx@example.com";
const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";
const ADSENSE_SLOT_SIDEBAR = "0000000001";
const ADSENSE_SLOT_RESULT = "0000000002";
```

`public/ads.txt` もAdSense管理画面に表示された正しい内容に差し替えてください。

## 2. AdSense script

本番で広告コードを有効化する場合は、`index.html` の `</head>` 直前に以下のようなコードを追加してください。

```html
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"></script>
```

`ca-pub-XXXXXXXXXXXXXXXX` は自分のパブリッシャーIDに差し替えます。

## 3. EU/英国/スイス向け同意

Google AdSenseの管理画面で `Privacy & messaging` から、Google認定CMP/同意メッセージを設定してください。

この仮サイトには簡易Cookieバナーを入れていますが、AdSense本番運用ではGoogle側の同意メッセージを設定するのが安全です。

## 4. 審査前チェック

- プライバシーポリシー
- Cookieについて
- お問い合わせ
- このサイトについて
- 免責事項
- 利用規約
- ads.txt
- robots.txt
- sitemap.xml
- 広告枠がボタン近くにないこと
- 「クリックして」など広告クリックを促す文言がないこと
