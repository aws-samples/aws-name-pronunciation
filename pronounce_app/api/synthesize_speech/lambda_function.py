import json
import boto3
import base64
from contextlib import closing


def lambda_handler(event, context):
    parameters = event.get("multiValueQueryStringParameters")
    user_name = parameters.get("user_name")[0]
    language_name = parameters.get("language_name")[0]
    voice_name = parameters.get("voice_name")[0]
    sorted_voices = json.loads(json.loads(event.get("body"))["sorted_voices_obj"])
    language_code = sorted_voices[language_name]["LanguageCode"]
    voice_id, engine = sorted_voices[language_name]["Voices"][voice_name]

    polly = boto3.client("polly")
    mp3_response = polly.synthesize_speech(
        Engine=engine,
        LanguageCode=language_code,
        OutputFormat="mp3",
        Text=user_name,
        VoiceId=voice_id
    )

    with closing(mp3_response["AudioStream"]) as stream:
        base64_bytes_stream = base64.b64encode(stream.read())
        base64_stream_string = base64_bytes_stream.decode('ascii')
        mp3_base64_str = "data:audio/mp3;base64," + base64_stream_string

        return {
            "statusCode": 200,
            "isBase64Encoded": True,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(
                {
                    "mp3_base64_str": mp3_base64_str
                }
            )
        }
