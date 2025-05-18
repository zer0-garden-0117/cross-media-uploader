#!/bin/bash

main() {
    # X投稿
    if ! ./x-uploader.sh; then
        echo "Error: x-uploader.sh failed" >&2
        return 1
    fi

    # ASB投稿
    if ! ./asb-uploader.sh; then
        echo "Error: asb-uploader.sh failed" >&2
        return 1
    fi

    echo "All scripts executed successfully"
    return 0
}

main
exit_status=$?
exit $exit_status