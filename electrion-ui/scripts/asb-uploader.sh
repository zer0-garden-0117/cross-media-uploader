#!/bin/bash

# ASB投稿スクリプト
# Cognitoでアクセストークンを取得し、カスタム認証トークンを取得して投稿を行う

# 設定ファイル
CONFIG_FILE=".env"

# 投稿情報
IMAGE_FILE="${1:-image.png}"          # 第1引数（デフォルト: image.png）
IMAGE_TITLE="${2:-test}"              # 第2引数（デフォルト: test）
IMAGE_TAG_CREATOR="${3:-creator}"     # 第3引数（デフォルト: creator）
IMAGE_TAG_CHARACTER="${4:-その他}"    # 第4引数（デフォルト: その他）
IMAGE_TAG_GENRE="${5:-illustration}"  # 第5引数（デフォルト: illustration）
IMAGE_TAG_OTHERS="${6:-test}"         # 第6引数（デフォルト: test）
WORK_DETAILS='{
  "apiWork": {
    "workId": "",
    "mainTitle": "'"${IMAGE_TITLE}"'",
    "subTitle": "",
    "description": "",
    "titleImgUrl": "",
    "thumbnailImgUrl": "",
    "watermaskImgUrl": "",
    "likes": 0,
    "createdAt": "2025-05-14T11:04:26.379Z",
    "updatedAt": "2025-05-14T11:04:26.379Z"
  },
  "apiTags": {
    "characters": ["'"${IMAGE_TAG_CHARACTER}"'"],
    "creators": ["'"${IMAGE_TAG_CREATOR}"'"],
    "genres": ["'"${IMAGE_TAG_GENRE}"'"],
    "formats": [""],
    "others": ["'"${IMAGE_TAG_OTHERS}"'"]
  }
}'

# トークン情報を保存するファイル
TOKEN_FILE="asb_token.json"

# 設定ファイルの読み込み
if [ ! -f "${CONFIG_FILE}" ]; then
  echo "設定ファイル ${CONFIG_FILE} が見つかりません。.env.exampleを参考に作成してください:"
  exit 1
fi
source "${CONFIG_FILE}"

# jqコマンドがインストールされているか確認
if ! command -v jq &> /dev/null; then
  echo "jqコマンドが見つかりません。インストールしてください:"
  echo "macOS: brew install jq"
  echo "Linux: sudo apt-get install jq"
  exit 1
fi

# Cognitoからアクセストークンを取得
function get_cognito_token() {
  echo "Cognitoからアクセストークンを取得中..."
  
  local response=$(aws cognito-idp admin-initiate-auth \
    --profile "${ASB_AWS_PROFILE}" \
    --region "${ASB_AWS_REGION}" \
    --user-pool-id "${ASB_USER_POOL_ID}" \
    --auth-flow ADMIN_USER_PASSWORD_AUTH \
    --client-id "${ASB_CLIENT_ID}" \
    --auth-parameters USERNAME="${ASB_USER_NAME}",PASSWORD="${ASB_USER_PASSWORD}" 2>&1)
  
  if [[ $response == *"error"* ]]; then
    echo "アクセストークンの取得に失敗しました"
    echo "エラー: ${response}"
    exit 1
  fi
  
  ACCESS_TOKEN=$(echo "${response}" | jq -r '.AuthenticationResult.AccessToken')
  
  if [ -z "${ACCESS_TOKEN}" ] || [ "${ACCESS_TOKEN}" = "null" ]; then
    echo "アクセストークンの解析に失敗しました"
    echo "レスポンス: ${response}"
    exit 1
  fi
  
  # トークン情報をファイルに保存
  echo "${response}" > "${TOKEN_FILE}"
  
  echo "Cognitoアクセストークンを取得しました"
}

# カスタム認証トークンを取得
function get_custom_token() {
  echo "カスタム認証トークンを取得中..."
  
  local response=$(curl -s -X GET "${ASB_API_ENDPOINT}/users/token" \
    -H "x-access-token: ${ACCESS_TOKEN}")
  
  USER_TOKEN=$(echo "${response}" | jq -r '.userToken')
  
  if [ -z "${USER_TOKEN}" ] || [ "${USER_TOKEN}" = "null" ]; then
    echo "カスタム認証トークンの取得に失敗しました"
    echo "レスポンス: ${response}"
    exit 1
  fi
  
  echo "カスタム認証トークンを取得しました"
}

# 作品を投稿
function post_work() {
  echo "作品を投稿中..."
  
  # 作品詳細をBase64エンコード
  local works_details_base64=$(echo -n "${WORK_DETAILS}" | base64)
  
  local response=$(curl -vX POST "${ASB_API_ENDPOINT}/works" \
    -H "Authorization: Bearer ${USER_TOKEN}" \
    -H "Content-Type: multipart/form-data" \
    -F "titleImage=@${IMAGE_FILE}" \
    -F "images=@${IMAGE_FILE}" \
    -F "worksDetailsBase64=${works_details_base64}")
  
  echo "投稿レスポンス: ${response}"
  
  # ここでレスポンスを解析して成功/失敗を判定できます
  # 例: 成功時にworkIdが返される場合
  local work_id=$(echo "${response}" | jq -r '.apiWork.workId')
  
  if [ -n "${work_id}" ] && [ "${work_id}" != "null" ]; then
    echo "作品の投稿に成功しました!"
    echo "作品ID: ${work_id}"
    echo "タイトル画像URL: $(echo "${response}" | jq -r '.apiWork.titleImgUrl')"
  else
    echo "作品の投稿に失敗しました"
    echo "エラーレスポンス: ${response}"
    exit 1
  fi
}

# メイン処理
function main() {
  # Cognitoトークン取得
  get_cognito_token
  
  # カスタム認証トークン取得
  get_custom_token
  
  # 画像ファイルの存在確認
  if [ ! -f "${IMAGE_FILE}" ]; then
    echo "画像ファイルが見つかりません: ${IMAGE_FILE}"
    exit 1
  fi
  
  # 作品投稿
  post_work
}

# スクリプトを実行
main