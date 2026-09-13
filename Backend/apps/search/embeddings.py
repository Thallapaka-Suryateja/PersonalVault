from huggingface_hub import InferenceClient
from django.conf import settings

client = InferenceClient(api_key=settings.HF_API_KEY)

def generate_embedding(text):
    result = client.feature_extraction(
        text,
        model="sentence-transformers/all-MiniLM-L6-v2",
    )
    return result.tolist() if hasattr(result, 'tolist') else list(result)