import React from "react";
import { render } from "@testing-library/react";
import Chat from "../components/Chat";

describe("Chat component", () => {
  test("renders chat header with title and close icon", () => {
    const setIsChatOpen = jest.fn(); // Mock function for setIsChatOpen

    // Render the Chat component
    const { getByText, getByTestId } = render(
      <Chat
        setIsChatOpen={setIsChatOpen}
        messages={[]} // Pass an empty array for messages
        CHAT_LIMIT={10}
        inputText="" // Pass an empty string for inputText
        setInputText={() => {}} // Mock function for setInputText
        handleKeyPress={() => {}} // Mock function for handleKeyPress
        handleMessageSend={() => {}} // Mock function for handleMessageSend
      />
    );

    // Assert that the chat title "Chat" is rendered within the chat header
    // const chatHeader = getByTestId("chat-header");
    const chatTitle = getByText("Chat", { container: chatHeader });
    expect(chatTitle).toBeInTheDocument();

    // Assert that the close icon is rendered with the correct test ID
    const closeIcon = getByTestId("close-icon");
    expect(closeIcon).toBeInTheDocument();
  });
});
