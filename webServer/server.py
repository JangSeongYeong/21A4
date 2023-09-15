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

# OpenCV로 웹캠 캡처
cap = cv2.VideoCapture(0)

# 웹 소켓 서버 설정
async def video_server(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.")  # 연결 시 출력할 메시지
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # 이미지를 base64로 인코딩
        _, buffer = cv2.imencode('.jpg', frame)
        frame_encoded = base64.b64encode(buffer).decode('utf-8')

        # 인코딩된 이미지 데이터를 클라이언트로 전송
        await websocket.send(frame_encoded)

# 현재 IP 주소 가져오기
ip_addr = get_host_ip()

start_server = websockets.serve(video_server, ip_addr, 8765)
print(f"WebSocket 서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
