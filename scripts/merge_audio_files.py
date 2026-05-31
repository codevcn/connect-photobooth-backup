import os
from pydub import AudioSegment

def parse_control_file(file_path):
    # (Phần đọc file văn bản giữ nguyên cấu trúc như trước)
    blocks = []
    current_path = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith('"') and line.endswith('.wav"'):
                current_path = line.strip('"')
            elif line.endswith('s'):
                try:
                    delay = float(line[:-1])
                    if current_path is not None:
                        blocks.append({'path': current_path, 'delay': delay})
                        current_path = None
                except ValueError:
                    pass
    return blocks

def concatenate_audio_with_pydub(blocks, output_path):
    if not blocks:
        print("Không có dữ liệu hợp lệ trong cấu hình.")
        return

    print("Đang tiến hành ghép nối bằng thư viện pydub...")
    # Khởi tạo một đoạn âm thanh trống (thời lượng 0 giây) để bắt đầu ghép nối
    final_audio = AudioSegment.empty()

    for block in blocks:
        file_path = block['path']
        delay_seconds = block['delay']

        if not os.path.exists(file_path):
            print(f"Cảnh báo: Không tìm thấy tệp {file_path}")
            continue

        # Đọc tệp âm thanh wav
        audio_segment = AudioSegment.from_wav(file_path)
        
        # Thư viện pydub sử dụng đơn vị mili-giây, nên ta cần nhân thời gian với 1000
        delay_ms = int(delay_seconds * 1000)
        silence = AudioSegment.silent(duration=delay_ms)

        # Trực tiếp ghép nối đoạn âm thanh hiện tại và khoảng lặng vào tệp tổng
        final_audio += audio_segment + silence

    # Xuất ra tệp kết quả trên ổ cứng
    final_audio.export(output_path, format="wav")
    print(f"Hoàn tất! Tệp âm thanh đã được lưu tại: {output_path}")

if __name__ == "__main__":
    blocks = parse_control_file("scripts/control-points.txt")
    concatenate_audio_with_pydub(blocks, "public/audios/tour-guide-audio.wav")