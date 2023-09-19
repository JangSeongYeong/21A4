import time
import serial
from gtts import gTTS
from playsound import playsound
import os

count = 0

# 시리얼 포트 설정 (아두이노 연결된 포트로 변경해야 합니다)
ser = serial.Serial('/dev/ttyACM0', 9600)  # 시리얼 포트 및 보드레이트 설정

while True:
    # 아두이노로부터 데이터 읽기
    data = ser.readline().decode('utf-8').rstrip()
    print(f'아두이노에서 받은 데이터: {data}')
    
    #아두이노로 부터 들어온 시리얼 값이 danger이면 실행
    if data == 'danger':
        playsound('/home/masgt/Desktop/ss/test1.mp3')
    

    #아래 코드는 업데이트 하는 대로 보내줌 지금은 무시하셈
    commend = 'b'
    ser.write(commend.encode())