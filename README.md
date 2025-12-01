# Kiseki

"迷える観光客"を"熱海ファン"に変える、AI旅のしおりアプリ

概要 (Overview)

Kiseki は、熱海観光における「坂道がつらい」「どこに行けばいいかわからない」という課題を解決する、体験特化型の観光ナビゲーションアプリです。

Googleマップのような「最短距離」ではなく、個人の体力や気分（「坂道を避けたい」「甘いものが食べたい」）に寄り添った「感情最適ルート」をAIが提案します。また、旅の記録（足跡）を自動で残し、失敗談も含めてコミュニティで共有することで、次の旅行者の道しるべを作ります。

背景

このプロジェクトは Startup Weekend にて、54時間で企画・開発されたMVP（Minimum Viable Product）です。
現地でのヒアリング（N=30）から「地形情報のミスマッチによる満足度低下」という課題を発見し、開発に至りました。

主な機能 (Features)

1. AIルート提案 (AI Route Optimizer)

診断機能: 「まったり癒やし派（坂道NG）」vs「健脚アクティブ派」など、簡単な質問でユーザー属性を診断。

最適ルート生成: 属性に合わせて、階段を避けた海沿いルートや、絶景ポイントを経由するルートを自動生成します。

XAI (説明可能なAI): 「なぜこのルートなのか？」の根拠（例：『階段回避』と『糖分補給』を優先しました）を提示し、納得感を醸成します。

2. 旅の足跡 & ログ (Activity Log)

GPSトラッキング: アプリを開いて歩くだけで、移動経路を地図上に記録。

自動チェックイン: お店に近づくと自動で訪問履歴に追加。

旅のアルバム: 撮影した写真やメモをタイムライン形式で振り返り。移動距離や消費カロリーも可視化します。

3. みんなの旅路 (Community)

失敗談の共有: 「ここに行ったら定休日だった」「この坂はきつすぎた」といったリアルな失敗談をシェア。

リアクション: 他人の旅ログに「いいね」やコメントが可能。貢献度に応じたポイント付与（ゲーミフィケーション）で投稿を促進します。

技術スタック (Tech Stack)

このプロトタイプは、高速な開発サイクルを回すためにモダンなWeb技術を採用しています。

Frontend: React (v18)

Styling: Tailwind CSS

Build Tool: Vite

Icons: Lucide React

Map/Visualization: SVG Drawing (Prototype)

Environment: WSL (Ubuntu)

セットアップ手順 (Getting Started)

手元の環境でこのプロジェクトを動かす手順です。

前提条件

Node.js (v18以上推奨)

npm

インストールと起動

# 1. リポジトリのクローン
git clone [https://github.com/YOUR_USERNAME/sw-atami3.git](https://github.com/YOUR_USERNAME/sw-atami3.git)
cd sw-atami3

# 2. 依存パッケージのインストール
npm install

# 3. 開発サーバーの起動
npm run dev


ブラウザで http://localhost:5173 にアクセスするとアプリが起動します。

ディレクトリ構成

atami-now/
├── public/             # 静的ファイル（地図画像など）
├── src/
│   ├── App.jsx         # アプリのメインロジック（全機能を集約）
│   ├── index.css       # Tailwindの読み込み設定
│   └── main.jsx        # エントリーポイント
├── tailwind.config.js  # Tailwind CSSの設定
└── vite.config.js      # Viteの設定


今後の展望 (Future Roadmap)

リアルデータ連携: Google Places API 及び Google Elevation API (標高データ) を組み込み、リアルタイムな「坂道回避アルゴリズム」を実装する。

バックエンド構築: Firebase Authentication によるログイン機能と、Firestore による旅ログの永続化。

地域連携: 熱海市内の店舗と連携し、送客クーポン機能の実装。

チーム (Team)

Engineering: あなたの名前

Biz/Design: チームメンバーの名前

Developed with love for Atami
