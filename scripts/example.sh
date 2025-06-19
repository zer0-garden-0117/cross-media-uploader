#!/bin/bash

# 引数が指定されていない場合はデフォルトでカレントディレクトリを表示
if [ $# -eq 0 ]; then
  ls .
else
  # 引数をそのまま ls に渡す
  ls "$@"
fi