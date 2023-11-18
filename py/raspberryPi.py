#-----------------------------

# 라즈베리 파이 코드

# websockets을 사용하여 진행.
# 1번 websocket 8765 - 영상데이터
# 2번 websocket 8766 - 웹 페이지로 데이터 전송
# 3번 websocket 8767 - 웹 페이지에서 데이터 수신

# video로 영상을 송출하는것이 아닌 img를 계속 전송하여 video처럼 보이게 되어있습니다.

# ------------------------------

from multiprocessing import Process
from playsound import playsound
import numpy as np
import cv2
import base64
import asyncio
import websockets
import socket
import serial
import time

# 데이터 변경에 따른 JS화면 전환 테스트용
global_data = '1'
count = 0
ser = serial.Serial('/dev/ttyACM0', 9600)


# 현재 IP 주소 가져오는 함수
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

# ip_addr에 이 파일을 실행하고 있는 ip를 저장
ip_addr = get_host_ip()

# OpenCV로 두 개의 웹캠 캡처
## 라즈베리 파이에 카메라 장치가 몇번 포트인지 모르기 때문에 조정이 필요함
cap1 = cv2.VideoCapture(0)                  # 카메라의 포트 조정
cap2 = cv2.VideoCapture(2)
cap1.set(cv2.CAP_PROP_FRAME_WIDTH, 320)     # 캡쳐 후 사진의 너비 조정
cap1.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)    # 캡쳐 후 사진의 높이 조정
cap2.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap2.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

# 아두이노 시리얼 읽어오기 - 센서 값을 읽어와야 하기 때문에 비동기로 실행
async def read_serial_data():
    global dataardu
    while True:
        data = ser.readline().decode('utf-8').rstrip()
        print(f'아두이노에서 받은 데이터: {data}')
        dataardu = data

# 웹 소켓 비디오 서버 설정
async def video_server(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.1")  # 연결 시 출력할 메시지
    while True:
        ret1, frame1 = cap1.read()
        ret2, frame2 = cap2.read()

        # 첫 번째 웹캠이 연결되지 않았을 경우, 빈 프레임을 생성
        if not ret1:
            frame1 = np.zeros((240, 320, 3), dtype=np.uint8)

        # 두 번째 웹캠이 연결되지 않았을 경우, 빈 프레임을 생성
        if not ret2:
            frame2 = np.zeros((240, 320, 3), dtype=np.uint8)

        # 이미지를 base64로 인코딩
        _, buffer1 = cv2.imencode('.jpg', frame1)
        frame_encoded1 = base64.b64encode(buffer1).decode('utf-8')

        _, buffer2 = cv2.imencode('.jpg', frame2)
        frame_encoded2 = base64.b64encode(buffer2).decode('utf-8')

        # 인코딩된 이미지 데이터를 클라이언트로 전송
        # 두 개의 비디오 프레임을 세미콜론으로 구분
        await websocket.send(frame_encoded1 + ";" + frame_encoded2)

# 압력 센서 -> 시리얼 값 파이썬으로 전송
# 센서의 번호에 맞춰 받는 시리얼 값을 수신해 값에 따른 특정 동작
async def data_Change():
    global global_data
    while True:
        dataardu = ser.readline().decode('utf-8').rstrip()
        
        if dataardu == 'danger_1':
            global_data = '1'
            playsound('/home/masgt/Desktop/ss/test1.mp3')   # 위험 경고 mp3
        elif dataardu == 'danger_2':
            global_data = '2'
            playsound('/home/masgt/Desktop/ss/test1.mp3')
        else:
            global_data ='0'
        
        return global_data

# 웹 페이지로 데이터 전송
async def send_data(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.2")  # 연결 시 출력할 메시지    
    while True:
        # 위험 사운드 실행 및 아두이노에서 받은 데이터 웹 페이지로 전송
        user_input = await data_Change() 
        await websocket.send(user_input)

# 데이터 수신했을때 동작하는 함수
async def handle_received_message(message):
    print("Received message:", message)
    commend = 'a'
    ser.write(commend.encode())
    time.sleep(0.1)
    commend = 'b'
    ser.write(commend.encode())
    time.sleep(0.1)

# 웹 페이지에서 데이터 수신
async def receive_data(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.3")
    async for message in websocket: #message: clear
        await handle_received_message(message)

# 웹 소켓 설정
start_server = websockets.serve(video_server, ip_addr, 8765)
print(f"video서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")
start_server2 = websockets.serve(send_data, ip_addr, 8766)
print(f"send서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")
start_server3 = websockets.serve(receive_data, ip_addr, 8767)
print(f"receive서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")

# 웹 소켓을 동시에 실행하기 위해서 함수화
def func0():
    # 비동기 이벤트 루프 시작
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

def func1():
    asyncio.get_event_loop().run_until_complete(start_server2)
    asyncio.get_event_loop().run_forever()

def func2():
    asyncio.get_event_loop().run_until_complete(start_server3)
    asyncio.get_event_loop().run_forever()

# 웹 소켓 실행 함수를 Process를 통해서 동시 실행
if __name__ == '__main__':
    p0 = Process(target=func0)
    p1 = Process(target=func1)
    p2 = Process(target=func2)
    p0.start()
    p1.start()
    p2.start()
    print("webSocket 준비완료")