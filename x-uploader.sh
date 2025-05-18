#!/bin/bash

# X投稿スクリプト
# X OAuth2認証と画像付き投稿のシェルスクリプト

# X APIのクライアントIDとクライアントシークレットとリダイレクトURLをconfig.iniから読み込む
CONFIG_FILE=".env"

# 投稿情報
IMAGE_FILE="image.png"
TWEET_TEXT="#AIイラスト #AIArt"

# スコープの設定
SCOPE="tweet.read tweet.write users.read offline.access media.write"

# トークン情報を保存するファイル
TOKEN_FILE="x_token.json"

# 設定ファイルの読み込み
if [ ! -f "${CONFIG_FILE}" ]; then
  echo "設定ファイル ${CONFIG_FILE} が見つかりません。.env.exampleを参考に作成してください:"
  exit 1
fi
source "${CONFIG_FILE}"
if [ -z "${X_CLIENT_ID}" ] || [ -z "${X_CLIENT_SECRET}" ] || [ -z "${X_REDIRECT_URI}" ]; then
  echo "設定ファイル ${CONFIG_FILE} にクライアントID、クライアントシークレット、リダイレクトURLを設定してください。"
  exit 1
fi

# 認証URLを開く
function open_auth_url() {
  local auth_url="https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${X_CLIENT_ID}&redirect_uri=${X_REDIRECT_URI}&scope=${SCOPE}&state=state&code_challenge=challenge&code_challenge_method=plain"
  
  echo "ブラウザで以下のURLを開いて認証してください:"
  echo "${auth_url}"
  echo ""
  
  # macOSでデフォルトブラウザを開く
  open "${auth_url}"
  
  echo "リダイレクトURLからcodeパラメータの値をコピーして、以下のプロンプトに貼り付けてください。"
  echo "例: <YOUR_REDIRECT_URL>/?state=state&code=xxxxxxxxxxxx"
  echo ""
  read -p "認証コードを入力してください: " AUTH_CODE
}

# アクセストークンを取得
function get_access_token() {
  local auth_basic=$(echo -n "${X_CLIENT_ID}:${X_CLIENT_SECRET}" | base64)
  
  echo "アクセストークンを取得中..."
  
  local response=$(curl --silent --location --request POST 'https://api.twitter.com/2/oauth2/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header "Authorization: Basic ${auth_basic}" \
    --data-urlencode "code=${AUTH_CODE}" \
    --data-urlencode 'grant_type=authorization_code' \
    --data-urlencode "redirect_uri=${X_REDIRECT_URI}" \
    --data-urlencode 'code_verifier=challenge')
  
  ACCESS_TOKEN=$(echo "${response}" | jq -r '.access_token')
  REFRESH_TOKEN=$(echo "${response}" | jq -r '.refresh_token')
  
  if [ -z "${ACCESS_TOKEN}" ] || [ "${ACCESS_TOKEN}" = "null" ]; then
    echo "アクセストークンの取得に失敗しました"
    echo "レスポンス: ${response}"
    exit 1
  fi
  
  # トークン情報をファイルに保存
  echo "${response}" > "${TOKEN_FILE}"
  
  echo "アクセストークンを取得しました"
  echo "リフレッシュトークンも保存しました"
}

# リフレッシュトークンを使ってアクセストークンを更新
function refresh_access_token() {
  # トークンファイルが存在するか確認
  if [ ! -f "${TOKEN_FILE}" ]; then
    echo "トークンファイルが見つかりません。先に認証を行ってください。"
    return 1
  fi
  
  # リフレッシュトークンを読み込む
  local saved_refresh_token=$(jq -r '.refresh_token' "${TOKEN_FILE}")
  
  if [ -z "${saved_refresh_token}" ] || [ "${saved_refresh_token}" = "null" ]; then
    echo "保存されたリフレッシュトークンが見つかりません。再度認証を行ってください。"
    return 1
  fi
  
  local auth_basic=$(echo -n "${X_CLIENT_ID}:${X_CLIENT_SECRET}" | base64)
  
  echo "リフレッシュトークンを使ってアクセストークンを更新中..."
  
  local response=$(curl --silent --location --request POST 'https://api.twitter.com/2/oauth2/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --header "Authorization: Basic ${auth_basic}" \
    --data-urlencode "refresh_token=${saved_refresh_token}" \
    --data-urlencode 'grant_type=refresh_token')
  
  # 新しいアクセストークンとリフレッシュトークンを取得
  local new_access_token=$(echo "${response}" | jq -r '.access_token')
  local new_refresh_token=$(echo "${response}" | jq -r '.refresh_token')
  
  if [ -z "${new_access_token}" ] || [ "${new_access_token}" = "null" ]; then
    echo "アクセストークンの更新に失敗しました"
    echo "レスポンス: ${response}"
    return 1
  fi
  
  # 新しいトークン情報を保存
  echo "${response}" > "${TOKEN_FILE}"
  
  # グローバル変数を更新
  ACCESS_TOKEN="${new_access_token}"
  REFRESH_TOKEN="${new_refresh_token}"
  
  echo "アクセストークンを更新しました"
  return 0
}

# 画像をアップロード
function upload_media() {
  local image_file="$1"
  
  if [ ! -f "${image_file}" ]; then
    echo "画像ファイルが見つかりません: ${image_file}"
    exit 1
  fi
  
  echo "画像をアップロード中: ${image_file}"
  
  local response=$(curl --silent -X POST 'https://api.twitter.com/2/media/upload' \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    -F "media=@\"${image_file}\"")
  
  MEDIA_ID=$(echo "${response}" | jq -r '.id')
  
  if [ -z "${MEDIA_ID}" ] || [ "${MEDIA_ID}" = "null" ]; then
    echo "画像のアップロードに失敗しました"
    echo "レスポンス: ${response}"
    exit 1
  fi
  
  echo "画像をアップロードしました。メディアID: ${MEDIA_ID}"
}

# 画像付きツイートを投稿
function post_tweet_with_media() {
  local text="$1"
  
  echo "ツイートを投稿中..."
  
  local response=$(curl --silent -X POST 'https://api.twitter.com/2/tweets' \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --header 'Content-Type: application/json' \
    --data "{
      \"text\": \"${text}\",
      \"media\": {
        \"media_ids\": [\"${MEDIA_ID}\"]
      }
    }")
  
  local tweet_id=$(echo "${response}" | jq -r '.data.id')
  
  if [ -z "${tweet_id}" ] || [ "${tweet_id}" = "null" ]; then
    echo "ツイートの投稿に失敗しました"
    echo "レスポンス: ${response}"
    exit 1
  fi
  
  echo "ツイートを投稿しました！"
  echo "ツイートURL: https://twitter.com/i/status/${tweet_id}"
}

# メイン処理
function main() {
  # jqコマンドがインストールされているか確認
  if ! command -v jq &> /dev/null; then
    echo "jqコマンドが見つかりません。Homebrewでインストールしてください:"
    echo "brew install jq"
    exit 1
  fi
  
  # リフレッシュトークンでアクセストークンを更新
  refresh_access_token || {
    echo "リフレッシュトークンでの更新に失敗しました。新規認証を行います。"
    open_auth_url
    get_access_token
  }

  # 画像をアップロード
  upload_media "${IMAGE_FILE}"
  
  # ツイートを投稿
  post_tweet_with_media "${TWEET_TEXT}"
}

# スクリプトを実行
main