import cv2
import base64
import asyncio
import websockets
import numpy as np
import socket

# 현재 IP 주소 가져오기
def get_host_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.1)
        # doesn't even have to be reachable
        s.connect(("10.0.0.0", 80))
        ip_addr = s.getsockname()[0]
    except Exception:
        ip_addr = "127.0.0.1"
    finally:
        s.close()
    return ip_addr

# OpenCV로 두 개의 웹캠 캡처
cap1 = cv2.VideoCapture(0)
cap2 = cv2.VideoCapture(1)

# 웹 소켓 서버 설정
async def video_server(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.")  # 연결 시 출력할 메시지
    while True:
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        # 첫 번째 웹캠이 연결되지 않았을 경우, 빈 프레임을 생성
        if not ret1:
            frame1 = np.zeros((480, 640, 3), dtype=np.uint8)

        # 두 번째 웹캠이 연결되지 않았을 경우, 빈 프레임을 생성
        if not ret2:
            frame2 = np.zeros((480, 640, 3), dtype=np.uint8)

        # 이미지를 base64로 인코딩
        _, buffer1 = cv2.imencode('.jpg', frame1)
        frame_encoded1 = base64.b64encode(buffer1).decode('utf-8')

        _, buffer2 = cv2.imencode('.jpg', frame2)
        frame_encoded2 = base64.b64encode(buffer2).decode('utf-8')

        # 인코딩된 이미지 데이터를 클라이언트로 전송
        await websocket.send(frame_encoded1 + ";" + frame_encoded2)  # 두 개의 비디오 프레임을 세미콜론으로 구분
        
# 현재 IP 주소 가져오기
ip_addr = get_host_ip()

start_server = websockets.serve(video_server, ip_addr, 8765)
print(f"WebSocket 서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
