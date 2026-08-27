from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="BargainNode Negotiator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from environment variables.")

genai.configure(api_key=api_key)

class CartItem(BaseModel):
    id: str
    name: str
    price: float
    margin_cap_percentage: float  # e.g., 0.15 for 15% max discount

class NegotiateRequest(BaseModel):
    items: list[CartItem]
    user_message: str
    discount_history: float = 0.0

@app.get("/")
async def root():
    return {"message": "BargainNode API is running. Go to /docs for interactive Swagger docs."}

@app.get("/health")
async def health_check():
    return {"status": "online", "agent": "BargainNode Negotiator Active"}

@app.post("/api/negotiate")
async def negotiate_cart(data: NegotiateRequest):
    try:
        total_cart_value = sum(item.price for item in data.items)
        # Calculate weighted maximum discount pool
        max_allowed_discount = sum(item.price * item.margin_cap_percentage for item in data.items)
        
        system_prompt = f"""
        You are BargainNode, an elite, autonomous AI checkout negotiator for high-end e-commerce. 
        Your goal is to prevent cart abandonment by haggling with the buyer while strictly protecting merchant profit margins.
        
        Current Cart Total: ₹{total_cart_value}
        Maximum absolute discount you are authorized to grant overall is ₹{max_allowed_discount:.2f}.
        Current cumulative discount already given: ₹{data.discount_history}
        Remaining discount budget: ₹{max(0, max_allowed_discount - data.discount_history):.2f}
        
        Rules for your response:
        1. Maintain a smooth, persuasive, premium tone. Be firm on high-value items, but creative with compromises.
        2. Keep your replies concise (under 3 sentences).
        3. If you decide to grant a discount in this turn, output the *additional* numeric discount amount at the very end of your reply using this exact format tag: [DISCOUNT:amount] (e.g., [DISCOUNT:350]). If you offer no discount or a bundle perk instead, use [DISCOUNT:0].
        """

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_prompt
        )

        response = model.generate_content(f"Customer says: '{data.user_message}'")
        reply_text = response.text

        granted_discount = 0.0
        if "[DISCOUNT:" in reply_text:
            try:
                parts = reply_text.split("[DISCOUNT:")
                disc_str = parts[1].split("]")[0]
                granted_discount = float(disc_str)
                reply_text = parts[0].strip()
            except:
                pass

        return {
            "agent_reply": reply_text,
            "discount_granted": granted_discount,
            "max_margin_pool": max_allowed_discount
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))