from flask import Flask, jsonify, request
from flask.helpers import send_file
import numpy as np
from transformers import RobertaTokenizer
import onnxruntime

from model import ensure_model_exists

app = Flask(__name__, static_url_path="/", static_folder="../web")

tokenizer = RobertaTokenizer.from_pretrained("roberta-base")

# ONNX model
model_url = "https://github.com/onnx/models/raw/refs/heads/main/validated/text/machine_comprehension/roberta/model/roberta-sequence-classification-9.onnx?download="
model_path = "model-download/roberta-sequence-classification-9.onnx"
ensure_model_exists(model_url, model_path)

ort_session = onnxruntime.InferenceSession(model_path)



@app.route("/")
def indexPage():
    return send_file("../web/index.html")


@app.route("/sentiment", methods=["GET"])
def test():

    text = request.args.get("text")
    if text == "":
        return "Please use text parameter in GET URL"

    input_ids = tokenizer.encode(text, add_special_tokens=True)
    ort_inputs = {
        ort_session.get_inputs()[0].name: np.array([input_ids], dtype=np.int64)
    }
    ort_out = ort_session.run(None, ort_inputs)
    results = ort_out[0][0]
    sentiment = np.exp(results) / np.sum(np.exp(results))

    return jsonify(
        {"negative": sentiment.tolist()[0], "positive": sentiment.tolist()[1]}
    )
