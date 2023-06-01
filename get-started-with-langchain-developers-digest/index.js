// PSUEDO CODE

// Check for vector store (.index file)

    // If there, just load the embeddings

    // Else
        // Go to the website

        // Download HTML body

        // Convert it to a markdown or text file

        // Load the text file

        // Create chunks from the text

        // Create documents for each of those chunks

        // Create a vector store for that

        // Save the vector store to a file

// Create new ChatOpenAI model object with API key

// Create a BufferMemory object to store previous messages

// Create a ConversationalRetrievalQAChain chain with the model, vector store as the retriever, and memory

// While (userQuery !== "q" || userQuery !== "quit")
    // Ask the question by calling the chain with the user query passed in
