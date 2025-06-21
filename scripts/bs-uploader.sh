#!/bin/bash

# -------------------------------------------------------------------
# Bluesky投稿スクリプト（画像投稿対応版）
# 使用方法: ./bluesky_post.sh "投稿メッセージ" [画像パス]
# -------------------------------------------------------------------

# 設定ファイル読み込み
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "エラー: .envファイルが見つかりません"
    exit 1
fi

# 環境変数チェック
if [ -z "$BS_HANDLE" ] || [ -z "$BS_APP_PASSWORD" ]; then
    echo "エラー: .envファイルにBS_HANDLEとBS_APP_PASSWORDが設定されていません"
    exit 1
fi

# 引数チェック（投稿メッセージ）
if [ -z "$1" ]; then
    POST_TEXT="Hello from shell script! #Bluesky"
else
    POST_TEXT="$1"
fi

# 画像パスチェック
IMAGE_PATH="$2"
HAS_IMAGE=0

if [ -n "$IMAGE_PATH" ]; then
    if [ -f "$IMAGE_PATH" ]; then
        HAS_IMAGE=1
        # 画像のMIMEタイプを取得
        IMAGE_MIME=$(file --mime-type -b "$IMAGE_PATH")
        # 対応するMIMEタイプか確認
        if [[ ! "$IMAGE_MIME" =~ ^image/(jpeg|png|gif|webp)$ ]]; then
            echo "エラー: 対応していない画像形式です (JPEG, PNG, GIF, WebPのみ対応)"
            exit 1
        fi
        
        # 画像の幅と高さを取得
        if command -v identify >/dev/null 2>&1; then
            IMAGE_INFO=$(identify -format "%[width] %[height]" "$IMAGE_PATH" 2>/dev/null)
            IMAGE_WIDTH=$(echo $IMAGE_INFO | awk '{print $1}')
            IMAGE_HEIGHT=$(echo $IMAGE_INFO | awk '{print $2}')
        else
            echo "警告: ImageMagickがインストールされていないため、デフォルトのアスペクト比を使用します"
            IMAGE_WIDTH=1000
            IMAGE_HEIGHT=1000
        fi
    else
        echo "エラー: 指定された画像ファイルが見つかりません: $IMAGE_PATH"
        exit 1
    fi
fi

# 認証処理
AUTH_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "identifier": "'"$BS_HANDLE"'",
        "password": "'"$BS_APP_PASSWORD"'"
    }' \
    https://bsky.social/xrpc/com.atproto.server.createSession)

# 認証エラーチェック
if ! echo "$AUTH_RESPONSE" | jq -e '.accessJwt' > /dev/null; then
    echo "認証失敗:"
    echo "$AUTH_RESPONSE" | jq
    exit 1
fi

# トークンとDIDを抽出
ACCESS_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.accessJwt')
DID=$(echo "$AUTH_RESPONSE" | jq -r '.did')

# 画像アップロード処理
if [ $HAS_IMAGE -eq 1 ]; then
    echo "画像をアップロード中..."
    IMAGE_UPLOAD_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: $IMAGE_MIME" \
        --data-binary @"$IMAGE_PATH" \
        https://bsky.social/xrpc/com.atproto.repo.uploadBlob)

    if ! echo "$IMAGE_UPLOAD_RESPONSE" | jq -e '.blob' > /dev/null; then
        echo "画像アップロード失敗:"
        echo "$IMAGE_UPLOAD_RESPONSE" | jq
        exit 1
    fi

    # 画像リファレンスを取得
    IMAGE_REF=$(echo "$IMAGE_UPLOAD_RESPONSE" | jq '.blob')
fi

# 投稿データの準備
POST_DATA='{
    "repo": "'"$DID"'",
    "collection": "app.bsky.feed.post",
    "record": {
        "text": "'"$POST_TEXT"'",
        "createdAt": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
        "$type": "app.bsky.feed.post"
'

# 画像がある場合は投稿データに追加（アスペクト比を含める）
if [ $HAS_IMAGE -eq 1 ]; then
    POST_DATA+=',"embed": {
        "$type": "app.bsky.embed.images",
        "images": [{
            "image": '"$IMAGE_REF"',
            "alt": "",
            "aspectRatio": {
                "width": '"$IMAGE_WIDTH"',
                "height": '"$IMAGE_HEIGHT"'
            }
        }]
    }'
fi

POST_DATA+='}}'

# デバッグ用にJSONデータを表示
echo "送信するJSONデータ:"
echo "$POST_DATA" | jq

# 投稿処理
POST_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$POST_DATA" \
    https://bsky.social/xrpc/com.atproto.repo.createRecord)

# 投稿結果チェック
if echo "$POST_RESPONSE" | jq -e '.error' > /dev/null; then
    echo "投稿失敗:"
    echo "$POST_RESPONSE" | jq
    exit 1
else
    echo "投稿成功:"
    echo "$POST_RESPONSE" | jq -r '.uri'
fi