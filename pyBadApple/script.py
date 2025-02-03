import cv2
import numpy as np
import os
import time

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def convert(frame, width=100):
    height = int(frame.shape[0] * width / frame.shape[1] / 2)

    frame = cv2.resize(frame, (width, height))
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    ascii_frame = ""
    for row in frame:
        for pixel in row:
            ascii_frame += "#" if pixel < 128 else "@"
        ascii_frame += "\n"
    return ascii_frame

def play(video, width=100):
    cap = cv2.VideoCapture(video)
    
    if not cap.isOpened():
        print("Erreur: Impossible d'ouvrir la vidéo, vérifier le chemin ou le nom de la vidéo")
        return
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_time = 1/fps
    
    try:
        while cap.isOpened():
            start_time = time.time()
            
            ret, frame = cap.read()
            if not ret:
                break

            ascii_frame = convert(frame, width)
            clear()
            print(ascii_frame)

            processing_time = time.time() - start_time
            wait_time = max(0, frame_time - processing_time)
            time.sleep(wait_time)
    finally:
        cap.release()

if __name__ == "__main__":
    video = "../Bad_Apple.mp4"
    
    play(video, width=80)