from transformers import pipeline

class ImagePredictor2:
    def __init__(self):
        pass
    def predict(self, image_paths):
        image_to_text = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

        return image_to_text(image_paths)
