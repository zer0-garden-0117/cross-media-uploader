import sys
from PyQt6.QtWidgets import (QApplication, QMainWindow, QLabel,
                            QLineEdit, QPushButton, QVBoxLayout,
                            QWidget, QFileDialog, QTextEdit)
from PyQt6.QtCore import Qt

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CROSS MEDIA UPLOADER")
        self.setup_ui()
        
        # D&Dを有効化
        self.setAcceptDrops(True)
        self.entry_image.setAcceptDrops(True)

    def setup_ui(self):
        # ウィジェット設定
        self.entry_image = QLineEdit()
        self.entry_image.setPlaceholderText("画像をドラッグ＆ドロップ or 選択ボタンで追加")
        
        btn_select = QPushButton("選択")
        btn_select.clicked.connect(self.select_image)

        self.entry_tags = QLineEdit()
        self.text_caption = QTextEdit()
        btn_submit = QPushButton("投稿する")

        # レイアウト
        layout = QVBoxLayout()
        layout.addWidget(QLabel("画像ファイル:"))
        layout.addWidget(self.entry_image)
        layout.addWidget(btn_select)
        
        layout.addWidget(QLabel("タグ (スペース区切り):"))
        layout.addWidget(self.entry_tags)
        
        layout.addWidget(QLabel("投稿文:"))
        layout.addWidget(self.text_caption)
        
        layout.addWidget(btn_submit)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def select_image(self):
        filepath, _ = QFileDialog.getOpenFileName(
            self,
            "画像を選択",
            "",
            "Image Files (*.png *.jpg *.jpeg *.gif)"
        )
        if filepath:
            self.entry_image.setText(filepath)

    # D&D関連のイベントハンドラ
    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls():
            event.acceptProposedAction()

    def dropEvent(self, event):
        for url in event.mimeData().urls():
            filepath = url.toLocalFile()
            if filepath.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                self.entry_image.setText(filepath)
                break
        event.acceptProposedAction()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.resize(500, 400)
    window.show()
    sys.exit(app.exec())