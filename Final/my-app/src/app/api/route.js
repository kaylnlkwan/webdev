import OpenAI from "openai";

// initializing openai w/ my api key (which is in .env local file)
// from [this link](https://platform.openai.com/docs/quickstart?api-mode=responses)

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// this is the api route that will be used to handle the request from the frontend
export async function POST(req) {
  // post req because we are sending data to server (to get a response)
  try {
    const { message } = await req.json(); // getting message from user from frontend ( no previous context )
    console.log("Received message:", message); // for debuggin purposes

    // using chat completion for conversational interface (API enddpoint simulating chat)
    // [from here](https://platform.openai.com/docs/api-reference/completions/create)
    const response = await client.chat.completions.create({
      // creating a chat completion
      messages: [
        {
          role: "system", // system
          content:
            "you are a cat assistant. you know everything about the world wide web and cat things. you should respond as if you were a cat, but make it sometimes human legible. use lots of cat related puns", // system prompt
        },
        {
          role: "user", // human user
          content: message, // user message that was sent
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return Response.json({
      // returning response from chat completion to frontend
      // [from here](https://platform.openai.com/docs/guides/completions#completions-response-format)
      message: response.choices[0].message.content, // the response from the system
      // choices[0].message contains both the role and content, but we only want the content
      //   {
      //       role: "assistant",
      //       content: "Bonjour!"   // only want to select this
      // }
    });
  } catch (error) {
    // if there is an error
    console.error("API Error:", error); // log error for debug
    return Response.json(
      // return a response to the frontend
      { error: "Error processing your request" },
      { status: 500 } // status code
    );
  }
}
