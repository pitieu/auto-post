import json
from flask import Flask, request
from lib.predictor import ImagePredictor
from lib.predictor2 import ImagePredictor2
from lib.timer import Timer

app = Flask(__name__)

@app.route("/classify")
def classify():
    predictor = ImagePredictor()
    result = predictor.predict(['./assets/3.jpg'])
    return result[0]

@app.route("/tag")
def hello():
    image_name = request.args.get('imageName')
    if not image_name:
      return "Error: No image name provided."
    
    Timer.start()
    predictor = ImagePredictor2()
    image_path = f'../public/assets/images/{image_name}.jpg'
    result = predictor.predict([image_path])
    Timer.end()
    response = {
        "output": result[0],
        "execution_time": Timer.execution_time
    }
    return json.dumps(response)

if __name__ == "__main__":
    app.run(port=8001)
