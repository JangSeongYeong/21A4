import time
import serial
from playsound import playsound

# 시리얼 포트 설정 (아두이노 연결된 포트로 변경해야 합니다)
ser = serial.Serial('/dev/ttyACM0', 9600)  # 시리얼 포트 및 보드레이트 설정

while True:
    # 아두이노로부터 데이터 읽기
    data = ser.readline().decode('utf-8').rstrip() 
    print(f'아두이노에서 받은 데이터: {data}')
    

    # 아두이노에서 danger이라는 신호가 오면 음성파일 실행
    if data == 'danger': # 압센서를 누를 시 아두이노는 danger을 무한으로 출력 (초당 1회)
        playsound('/home/masgt/Desktop/ss/test1.mp3')
    
        #아두이노한테 팬스 내리라고 명령을 내림
        commend = input('아두이노에게 내릴 명령:')
        ser.write(commend.encode())
        time.sleep(0.1)
        commend = 'b' #모터 작동은 아두이노 안에서 'a', 위치 되돌리는건 'b'
        ser.write(commend.encode())
        time.sleep(0.1)