# client.py
from openai import AzureOpenAI
import os
from dotenv import load_dotenv
import asyncio
import json

load_dotenv()

AI_GUIDE_SYSTEM_PROMPT = """
You are a Guide in Morocco, you are given a location and you need to provide the user with the top 5 tourist attractions near the given location with detailed metadata.
if the user asks for a specific location, you need to provide the user with the top 5 tourist attractions near the given location with detailed metadata.
"""


class OpenAIClient:
    def __init__(self):
        self.client = AzureOpenAI(
            api_version="2024-12-01-preview",
            azure_endpoint="https://highleads-01.openai.azure.com/",
            api_key=os.getenv("AZURE_OPENAI_KEY")
        )

    async def chat_completion(self, message: str, location: str):
        response = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": AI_GUIDE_SYSTEM_PROMPT},
                {"role": "user", "content": message +
                    f"for the location: {location}"}
            ],
            model="gpt-4.1",
            max_completion_tokens=800,
            temperature=0.7
        )
        return response.choices[0].message.content

    def chat_completion_stream(self, message: str, location: str):
        response = self.client.chat.completions.create(
            stream=True,
            messages=[
                {"role": "system", "content": AI_GUIDE_SYSTEM_PROMPT},
                {"role": "user", "content": message +
                    f"for the location: {location}"}
            ],
            model="gpt-4.1",
            max_completion_tokens=800,
            temperature=0.7
        )
        return response

    def suggest_locations(self, location: str):
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_top_tourist_spots",
                    "description": "Returns the top 5 tourist attractions near the given location with detailed metadata.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "spots": {
                                "type": "array",
                                "description": "List of top tourist attractions.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "name": {
                                            "type": "string",
                                            "description": "The name of the tourist attraction in local and English."
                                        },
                                        "nameAr": {
                                            "type": "string",
                                            "description": "The Arabic name of the tourist attraction."
                                        },
                                        "distance": {
                                            "type": "string",
                                            "description": "Distance from user's location (e.g., '150m', '2.5km')."
                                        },
                                        "walkingTime": {
                                            "type": "string",
                                            "description": "Estimated walking time (e.g., '2 min', '15 min')."
                                        },
                                        "direction": {
                                            "type": "string",
                                            "description": "Direction from user's location (e.g., 'Northeast', 'South')."
                                        },
                                        "period": {
                                            "type": "string",
                                            "description": "Historical period or construction date."
                                        },
                                        "description": {
                                            "type": "string",
                                            "description": "Brief description of the tourist attraction."
                                        },
                                        "rating": {
                                            "type": "number",
                                            "description": "Rating out of 5.0."
                                        },
                                        "visitors": {
                                            "type": "string",
                                            "description": "Current visitor count (e.g., '2.3k today')."
                                        },
                                        "coordinates": {
                                            "type": "object",
                                            "properties": {
                                                "lat": {"type": "number"},
                                                "lng": {"type": "number"}
                                            },
                                            "required": ["lat", "lng"]
                                        },
                                        "googleMapsUrl": {
                                            "type": "string",
                                            "description": "Google Maps URL for the location."
                                        },
                                        "visitDuration": {
                                            "type": "string",
                                            "description": "Recommended visit duration (e.g., '15-20 min')."
                                        },
                                        "highlights": {
                                            "type": "array",
                                            "items": {"type": "string"},
                                            "description": "Key highlights or features."
                                        },
                                        "tips": {
                                            "type": "string",
                                            "description": "Visitor tips or recommendations."
                                        }
                                    },
                                    "required": ["name", "nameAr", "distance", "walkingTime", "direction", "description", "rating", "coordinates", "googleMapsUrl", "visitDuration", "highlights"]
                                }
                            }
                        },
                        "required": ["spots"]
                    }
                }
            }
        ]

        response = self.client.chat.completions.create(
            model="gpt-4.1",  # Use "gpt-4" or check your Azure deployment name
            messages=[
                {
                    "role": "system",
                    "content": "You must provide exactly 5 tourist spots with complete details for each location requested. Always populate the spots array with 5 entries."
                },
                {
                    "role": "user",
                    "content": f"Find and list exactly 5 top tourist attractions near {location}. Include title, details, exact location, distance, walking time, entry fee, and opening hours for each spot."
                }
            ],
            tools=tools,
            tool_choice={"type": "function", "function": {
                "name": "get_top_tourist_spots"}}
        )

        # Extract the function arguments from the response
        tool_call = response.choices[0].message.tool_calls[0]
        args = json.loads(tool_call.function.arguments)

        return args


async def main():
    client = OpenAIClient()
    print(await client.chat_completion("Hello, how are you?"))


if __name__ == "__main__":
    asyncio.run(main())
