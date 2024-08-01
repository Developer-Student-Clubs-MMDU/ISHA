# import os
# from PyPDF2 import PdfReader
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.vectorstores import FAISS
# from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
# from langchain.chains.question_answering import load_qa_chain
# from langchain.prompts import PromptTemplate
# from dotenv import load_dotenv
# import google.generativeai as genai

# # Load environment variables
# load_dotenv()
# api_key = os.getenv("GOOGLE_API_KEY")
# if api_key is None:
#     raise ValueError("GOOGLE_API_KEY environment variable not set")

# genai.configure(api_key=api_key)

# # Define the list of predefined PDF file paths
# predefined_pdfs = ["loops.pdf", "strings.pdf", "tuple_dict_set.pdf"]

# def get_pdf_text(pdf_files):
#     text = ""
#     for pdf_file in pdf_files:
#         abs_path = os.path.join(os.path.dirname(__file__), pdf_file)
#         if os.path.exists(abs_path):
#             pdf_reader = PdfReader(abs_path)
#             for page in pdf_reader.pages:
#                 text += page.extract_text()
#         else:
#             print(f"File not found: {pdf_file}")
#     return text

# def get_text_chunks(text):
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
#     chunks = text_splitter.split_text(text)
#     return chunks

# def get_vector_store(text_chunks):
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
#     vector_store.save_local("faiss_index")

# def get_conversational_chain():
#     prompt_template = """
#     Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
#     provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
#     Context:\n {context}?\n
#     Question: \n{question}\n

#     Answer:
#     """
#     model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
#     prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
#     chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
#     return chain

# def user_input(user_question):
#     embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
#     new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
#     docs = new_db.similarity_search(user_question)
#     chain = get_conversational_chain()
#     response = chain(
#         {"input_documents": docs, "question": user_question},
#         return_only_outputs=True
#     )
#     print("Reply: ", response["output_text"])

# def main():
#     print("Intelligent System for Hyper Accelerated Learning")

#     processed_file = "predefined_pdfs_processed.txt"
#     if os.path.exists(processed_file):
#         with open(processed_file, "r") as f:
#             processed = f.read()
#     else:
#         processed = ""

#     if not processed:
#         print("Processing PDF files...")
#         raw_text = get_pdf_text(predefined_pdfs)
#         text_chunks = get_text_chunks(raw_text)
#         get_vector_store(text_chunks)
#         with open(processed_file, "w") as f:
#             f.write("processed")
#         print("PDF files processed successfully.")
#     else:
#         print("PDF files already processed.")

#     user_question = input("Your Question Here: ")

#     if user_question:
#         user_input(user_question)

# if __name__ == "__main__":
#     main()

import os
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import warnings
import sys
import json

warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

# Define the list of predefined PDF file paths
predefined_pdfs = ["loops.pdf", "strings.pdf", "tuple_dict_set.pdf"]

def get_pdf_text(pdf_files):
    text = ""
    for pdf_file in pdf_files:
        pdf_reader = PdfReader(pdf_file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()

    response = chain(
        {"input_documents": docs, "question": user_question},
        return_only_outputs=True
    )

    print(json.dumps({"Reply": str(response["output_text"])}))

def main(user_question):
    # Process PDFs and build the vector store
    raw_text = get_pdf_text(predefined_pdfs)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)
    user_input(str(user_question))
    # Example user input handling
    # user_question = input("Your Question Here: ")
    # if user_question:
    #     

if __name__ == "__main__":
    user_question = sys.argv[1]
    main(user_question)

