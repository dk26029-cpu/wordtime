# 사진 인식 파일 (오프라인용)

앱 안에서 사진 속 글자를 읽는 Tesseract.js 파일이에요. 인터넷에서 받지 않고 앱에 들어 있어서,
한 번 쓴 뒤로는 인터넷 없이도 사진 인식이 돼요.

- `tesseract.min.js`, `worker.min.js`: tesseract.js 5.1.1 (Apache-2.0)
- `core/`: tesseract.js-core 5.1.1, LSTM 전용 (SIMD 지원 폰용과 미지원 폰용)
- `lang/`: 한국어·영어 인식 데이터 4.0.0_best_int (가벼운 정수형 모델, Apache-2.0)
