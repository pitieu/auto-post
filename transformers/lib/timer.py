import time
import math

class Timer:
    start_time = 0
    end_time = 0
    execution_time = 0

    @staticmethod
    def start():
        Timer.start_time = time.time()

    @staticmethod
    def end():
        Timer.end_time = time.time()
        Timer.execution_time = math.ceil((Timer.end_time - Timer.start_time) * 1000)
        print("Execution time:", Timer.execution_time ,"ms")
