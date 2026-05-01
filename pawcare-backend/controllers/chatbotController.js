const OpenAI = require("openai");
const Pet = require("../models/Pet"); // Import your Pet model

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

exports.chatWithBot = async (req, res) => {
  try {
    const { message, petId } = req.body; // Receive petId instead of just petType

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let petContext = "No specific pet data provided.";
    
    // 1. Fetch the pet's medical record if petId is provided
    if (petId) {
      const pet = await Pet.findById(petId);
      if (pet) {
        petContext = `
          Patient Name: ${pet.name}
          Species: ${pet.type}
          Breed: ${pet.breed}
          Age: ${pet.age}
          Sex: ${pet.sex}
          Vaccination Status: ${pet.vaccinationStatus}
          Last Vet Visit: ${pet.lastVetVisit}
          Neutered/Spayed: ${pet.neutered}
          Weight: ${pet.weight}
          Existing Medical Notes: ${pet.notes}
          Behavioral Notes: ${pet.behaviorNotes}
        `;
      }
    }

    // 2. Send the record context to the AI
    const completion = await client.chat.completions.create({
      model: "openrouter/free", // Or use a specific model like "google/gemini-2.0-flash-exp:free"
      messages: [
        {
          role: "system",
          content: `You are a professional veterinary assistant. 
          Use the following pet medical context to provide specific and safe symptom analysis. 
          If symptoms sound urgent (difficulty breathing, extreme lethargy, bleeding), strongly advise visiting ${petId ? 'their vet ' + (petContext.vetName || '') : 'a vet'} immediately.
          
          PET MEDICAL RECORD:
          ${petContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI assistant failed",
      details: error.message,
    });
  }
};