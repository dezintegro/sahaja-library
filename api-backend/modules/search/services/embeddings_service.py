from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

def get_text_embedding(text):
    # Encode the text to get the embedding
    embedding = model.encode(text)
    
    # Convert to a list of floats (for database storage)
    return embedding.tolist()


if __name__ == "__main__":
    # Example usage
    text = "Сахаджа йога - это метод медитации"
    embedding = get_text_embedding(text)

    print(f"Embedding shape: {np.array(embedding).shape}")
    print(f"First few values: {embedding[:5]}")
