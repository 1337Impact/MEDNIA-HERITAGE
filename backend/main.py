# main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import time
import base64
import asyncio
from client import OpenAIClient
from database import DatabaseManager
from fastapi.middleware.cors import CORSMiddleware
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError


app = FastAPI()

# https://linkyfire.vet/ api.linkyfire.vet
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000",
                   "https://linkyfire.vet", "https://api.linkyfire.vet", "api.linkyfire.vet", "linkyfire.vet"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_client = OpenAIClient()
db_manager = DatabaseManager()


class MessageRequest(BaseModel):
    message: str


class MessageResponse(BaseModel):
    response: str


class MessageHistory(BaseModel):
    id: int
    user_id: int
    user_message: str
    ai_response: str
    timestamp: str


def coordinates_to_location(coordinates: str):
    lat, lon = map(float, coordinates.split(','))

    # Initialize geocoder
    geolocator = Nominatim(user_agent="location_finder")

    # Reverse geocode
    location = geolocator.reverse(f"{lat}, {lon}", exactly_one=True)

    if location:
        return location.address
    else:
        return coordinates


@app.post("/chat", response_model=MessageResponse)
async def chat_with_openai(request: MessageRequest, user_id: int, location: str):
    try:
        ai_response = await openai_client.chat_completion(
            message=request.message,
            location=coordinates_to_location(location)
        )

        await db_manager.save_message(
            user_id=user_id,
            user_message=request.message,
            ai_response=ai_response
        )

        return MessageResponse(response=ai_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/suggest-locations")
async def suggest_locations(user_id: int, location: str):
    if not user_id or not location:
        raise HTTPException(
            status_code=400, detail="User ID and location are required")
    try:
        response = openai_client.suggest_locations(
            coordinates_to_location(location))
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/messages", response_model=List[MessageHistory])
async def get_messages(user_id: int, limit: int = 50, offset: int = 0):
    try:
        messages = await db_manager.get_messages(user_id=user_id, limit=limit, offset=offset)
        return messages
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.get("/messages/{message_id}", response_model=MessageHistory)
async def get_message(message_id: int):
    try:
        message = await db_manager.get_message_by_id(message_id)
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")
        return message
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.delete("/messages/{message_id}")
async def delete_message(message_id: int):
    try:
        deleted = await db_manager.delete_message(message_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message": "Message deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.post("/chat/stream")
async def chat_stream(request: MessageRequest):
    try:
        start_time = time.time()
        response_parts = []

        response = openai_client.chat_completion_stream(
            message=request.message
        )

        def generate():
            nonlocal response_parts
            for chunk in response:
                if chunk.choices:
                    content = chunk.choices[0].delta.content
                    if content:
                        response_parts.append(content)
                        yield f"data: {content}\n\n"
            yield "data: [DONE]\n\n"

            # Save to database after streaming completes
            full_response = ''.join(response_parts)
            response_time_ms = int((time.time() - start_time) * 1000)

            asyncio.create_task(db_manager.save_message(
                user_message=request.message,
                system_prompt=request.system_prompt,
                ai_response=full_response,
                response_time_ms=response_time_ms
            ))

        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/analyze-image", response_model=MessageResponse)
async def process_image(file: UploadFile = File(...), user_id: int = None):
    try:
        # Check file size limit (1MB = 1 * 1024 * 1024 bytes)
        file_size = 0
        MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB in bytes
        
        # Read file in chunks to get size
        chunk_size = 1024  # 1KB chunks
        while True:
            chunk = await file.read(chunk_size)
            if not chunk:
                break
            file_size += len(chunk)
            if file_size > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=400,
                    detail="File size exceeds 1MB limit"
                )
        
        # Reset file position for full read
        await file.seek(0)
        
        # Read the image file
        image_content = await file.read()
        print(f"Received image: {file.filename}, size: {file_size} bytes")

        # Convert to base64
        base64_image = base64.b64encode(image_content).decode('utf-8')
        print(f"Base64 image size: {len(base64_image)} characters")
        print("Base64 image conversion successful")

        try:
            # Get response from OpenAI
            ai_response = await openai_client.analyze_image(base64_image)
            print("AI Response received successfully")
            return MessageResponse(response=ai_response)
        except Exception as openai_error:
            print(f"OpenAI API Error: {str(openai_error)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error from OpenAI API: {str(openai_error)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
