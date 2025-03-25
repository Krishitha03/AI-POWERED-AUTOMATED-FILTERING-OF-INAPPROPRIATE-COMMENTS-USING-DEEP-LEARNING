from flask import Flask, request, jsonify
import googleapiclient.discovery
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model #type:ignore
from tensorflow.keras.layers import TextVectorization #type:ignore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow all requests

# Load model
model = load_model("toxicity10epoch.h5")
sequence_length = 1800
MAX_FEATURES = 200000
vectorizer = TextVectorization(max_tokens=MAX_FEATURES,
                               output_sequence_length=sequence_length,
                               output_mode='int')

df = pd.read_csv('train.csv')
vectorizer.adapt(df['comment_text'].values)

# YouTube API
api_service_name = "youtube"
api_version = "v3"
DEVELOPER_KEY = "AIzaSyABP2SteqNGg1ucp3jk5EH9qtE7JqP_MKA"

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=DEVELOPER_KEY)

@app.route('/toxic_comments', methods=['POST'])
def get_toxic_comments():
    data = request.get_json()
    videoId = data.get("videoId")

    if not videoId:
        return jsonify({"error": "Invalid YouTube video ID"}), 400

    video_request = youtube.commentThreads().list(
        part="snippet",
        videoId=videoId,
        maxResults=100
    )

    comments = []
    response = video_request.execute()

    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']
        comments.append({
            "author": comment['authorDisplayName'],
            "updated_at": comment['publishedAt'],
            "text": comment['textOriginal'],
            "likes": comment['likeCount']
        })

    # Convert comments to DataFrame
    dfr = pd.DataFrame(comments)

    # Vectorize comments
    input_text = vectorizer(np.array(dfr['text']))
    predictions = model.predict(input_text)
    binary_predictions = (predictions > 0.5).astype(int)

    # Identify toxic and non-toxic comments
    toxic_indices = np.where(np.any(binary_predictions == 1, axis=1))[0]
    nontoxic_indices = np.where(np.all(binary_predictions == 0, axis=1))[0]

    toxic_count = len(toxic_indices)
    nontoxic_count = len(nontoxic_indices)

    # Add prediction column
    prediction_labels = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
    dfr["prediction"] = [dict(zip(prediction_labels, pred.tolist())) for pred in binary_predictions]

    # Filter only toxic comments
    toxic_comments = dfr.iloc[toxic_indices].to_dict(orient="records")

    return jsonify({
        "toxic_comments": toxic_comments,
        "toxic_count": toxic_count,
        "nontoxic_count": nontoxic_count
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)