import asyncio
import websockets
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

async def send_data(websocket, path):
    print("WebSocket 클라이언트가 연결되었습니다.")  # 연결 시 출력할 메시지
    while True:
        user_input = "시발"
        await asyncio.sleep(2)
        await websocket.send(user_input)

# 현재 IP 주소 가져오기
ip_addr = get_host_ip()
print(f"Server running at ws://{ip_addr}:8766")

# 웹 소켓 서버 설정
start_server = websockets.serve(send_data, ip_addr, 8766)
print(f"WebSocket 서버가 시작되었습니다. 클라이언트 연결을 기다립니다... (IP 주소: {ip_addr})")

# 비동기 이벤트 루프 시작
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
