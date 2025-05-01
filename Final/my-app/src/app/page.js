"use client"; // using use client since client component
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState(""); // creating a state for input message
  const [messages, setMessages] = useState([]); // creating a state for messages to hold array
  const [isLoading, setIsLoading] = useState(false); // creating a state for loading
  const messagesEndRef = useRef(null); // using [this tutorial](https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react)

  // function to scroll to bottom of the chat
  // using [this method](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // if messages end ref is not null, scroll to bottom
  };

  // scroll to bottom when messages change (so automatically scrolls to most recent message)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // function to handle message submit
  const handleSubmit = async (e) => {
    // async since we're waiting on response from api (+ there are awaits inside)
    e.preventDefault(); // prevent default beahvior of form (refreshing page)
    if (!input.trim()) return;

    // adding user message to the chat array
    setMessages((prev) => [...prev, { role: "user", content: input }]); // taking previous messages, appending the newest one
    setIsLoading(true); // set it as loading once user submits message

    try {
      // fetch the new message / response from the api
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // specifying we are sending json data
        },
        body: JSON.stringify({ message: input }), // sending the message to api through the body
      });

      const data = await response.json(); // getting response from api
      console.log("Received AI response:", data.message);

      // add the new ai response to the chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message }, // data.message contains the new ai message
      ]);
    } catch (error) {
      console.error("Error:", error); // logging error for debugging
      setMessages((prev) => [
        ...prev, // append newest error message to the chat array
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }

    setInput(""); // clear input
    setIsLoading(false); // stop loading
  };

  return (
    <main className="flex flex-col p-8">
      <div className="flex flex-col mb-8 text-3xl font-medium max-w-7xl">
        <div className="text-[#959595]">Mr. Miffles</div>
        <div className="text-black">
          This is your friendly cat assistant, Mr. Miffles. Mr. Miffles knows
          everything about the world wide web, but he is prone to only speaking
          in cat. Communicate at your own risk.
        </div>
      </div>
      <div className="relative mb-16">
        {/* cat image */}
        <Image
          src="/cat.svg"
          alt="Cat"
          width={120}
          height={120}
          className="absolute -top-28 right-0 z-10"
        />
        <div className="w-full mx-auto rounded-lg overflow-hidden border border-black">
          {/* top bar of terminal */}
          <div className="bg-[#f0f0f0] px-4 py-2 flex items-center justify-between border-b border-black">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF605C]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD44]"></div>
              <div className="w-3 h-3 rounded-full bg-[#00CA4E]"></div>
            </div>
            <div className="font-mono text-sm text-gray-600">
              /catgpt/desktop/gpt.cat
            </div>
            <div className="w-8"></div>
          </div>

          {/* content of terminal */}
          <div className="bg-[#1E1E1E] text-white p-6 font-mono min-h-[60vh] max-h-[60vh] flex flex-col">
            {/* messages container */}
            <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="text-white-200">
                    {message.role === "user" ? ">" : "$"}
                  </span>
                  <span className="ml-2">{message.content}</span>
                </div>
              ))}
              {isLoading && <div className="text-gray-500">Paw-cessing...</div>}
              <div ref={messagesEndRef} />{" "}
              {/* this is the div that will scroll to the bottom */}
            </div>

            {/* input messages */}
            <div className="mt-auto">
              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-white-200 mr-2">&gt;</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-white"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* navigation links */}
      <div className="fixed bottom-0 left-0 p-8">
        <div className="flex flex-row">
          <Link
            href="https://www.kaylnkwan.com/"
            className="text-black bg-[#EFEFEF] border border-[#00000014] rounded-full px-4 py-1 hover:bg-[#e0e0e0] transition-colors duration-200"
          >
            Portfolio
          </Link>
          <Link
            href="https://catoftheday.com/"
            className="text-black bg-[#EFEFEF] border border-[#00000014] rounded-full px-4 py-1 hover:bg-[#e0e0e0] transition-colors duration-200"
          >
            Cats
          </Link>
          <a
            href="https://cataas.com/"
            target="_blank"
            className="text-black bg-[#EFEFEF] border border-[#00000014] rounded-full px-4 py-1 hover:bg-[#e0e0e0] transition-colors duration-200"
          >
            More Cats
          </a>
        </div>
      </div>
    </main>
  );
}
