import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.ml.model import ModelManager

app = FastAPI(
    title="SecureMailScope Backend",
    description="AI-assisted cryptographic security posture assessment for email.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "*"], # Allow frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    # Train the ML model on synthetic data at startup as requested
    model_manager = ModelManager.get_instance()
    model_manager.train_on_synthetic_data()
    print("Backend started successfully.")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
