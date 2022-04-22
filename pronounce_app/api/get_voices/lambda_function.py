import json
import boto3
from iso639 import Lang


def lambda_handler(event, context):
    polly = boto3.client("polly")

    voices_standard_response = polly.describe_voices(
        Engine='standard',
        IncludeAdditionalLanguageCodes=True
    )

    voices = {}
    for voice_obj in voices_standard_response["Voices"]:
        language_name = voice_obj["LanguageName"]
        language_code = voice_obj["LanguageCode"]
        voice_name = voice_obj["Name"]
        voice_id = voice_obj["Id"]
        if language_name in voices:
            voices[language_name]["Voices"][voice_name] = [voice_id, "standard"]
        else:
            voices[language_name] = {
                "Voices": {
                    voice_name: [voice_id, "standard"]
                },
                "LanguageCode": language_code
            }
        if "AdditionalLanguageCodes" in voice_obj:
            additional_language_codes = voice_obj["AdditionalLanguageCodes"]
            for code in additional_language_codes:
                language_iso, country_iso = code.split("-")
                language_name = Lang(language_iso).name
                voices[language_name] = {
                    "Voices": {
                        voice_name: [voice_id, "standard"]
                    },
                    "LanguageCode": code
                }

    voices_neural_response = polly.describe_voices(
        Engine="neural",
        IncludeAdditionalLanguageCodes=True
    )

    for voice_obj in voices_neural_response["Voices"]:
        language_name = voice_obj["LanguageName"]
        language_code = voice_obj["LanguageCode"]
        voice_name = voice_obj["Name"]
        voice_id = voice_obj["Id"]
        supported_engines = voice_obj["SupportedEngines"]
        if "standard" in supported_engines:
            voices[language_name]["Voices"][voice_name][1] = "neural"
        elif language_name in voices:
            voices[language_name]["Voices"][voice_name] = [voice_id, "neural"]
        else:
            voices[language_name] = {
                "Voices": {
                    voice_name: [voice_id, "neural"]
                },
                "LanguageCode": language_code
            }
        if "AdditionalLanguageCodes" in voice_obj:
            additional_language_codes = voice_obj["AdditionalLanguageCodes"]
            for code in additional_language_codes:
                language_iso, country_iso = code.split("-")
                language_name = Lang(language_iso).name
                voices[language_name] = {
                    "Voices": {
                        voice_name: [voice_id, "neural"]
                    },
                    "LanguageCode": code
                }

    for language in voices.keys():
        voices[language]["Voices"] = dict(
            sorted(voices[language]["Voices"].items(), key=lambda key_value_pair: key_value_pair[0]))

    sorted_voices = dict(sorted(voices.items(), key=lambda key_value_pair: key_value_pair[0]))

    return {
        "statusCode": 200,
        "isBase64Encoded": False,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(
            {
                "sorted_voices": sorted_voices
            }
        )
    }
