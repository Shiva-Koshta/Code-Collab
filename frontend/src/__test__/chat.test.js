import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Chat from "../components/Chat"; // Adjust the import path as needed

// import { shallow } from 'enzyme'; // Assuming you're using Enzyme for shallow rendering
// Mock the DisabledByDefaultIcon component
// jest.mock("@mui/icons-material/DisabledByDefault", () => {
//   return {
//     __esModule: true,
//     default: () => <div className="disabled-by-default-icon"></div>,
//   };
// });

describe("Chat component", () => {
  test("input field renders and updates inputText state correctly", () => {
    const setInputTextMock = jest.fn(); // Mock function for setInputText
    const inputText = "Test message";

    // Render the Chat component
    const { getByPlaceholderText } = render(
      <Chat
        setIsChatOpen={() => {}} // Mock function for setIsChatOpen
        messages={[]} // Empty array for messages
        CHAT_LIMIT={10} // Example CHAT_LIMIT value
        inputText={inputText} // Pass the inputText value
        setInputText={setInputTextMock} // Pass the mock function for setInputText
        handleKeyPress={() => {}} // Mock function for handleKeyPress
        handleMessageSend={() => {}} // Mock function for handleMessageSend
      />
    );

    // Find the input field by its placeholder text
    const inputField = getByPlaceholderText("Type your message...");

    // Check if the input field renders with the correct value
    expect(inputField.value).toBe(inputText);

    // Simulate a change event on the input field
    fireEvent.change(inputField, { target: { value: "New test message" } });

    // Check if setInputTextMock is called with the correct value
    expect(setInputTextMock).toHaveBeenCalledWith("New test message");
  });
  //   test('renders properly with messages and input field', () => {
  //     const setIsChatOpen = jest.fn();
  //     const messages = [
  //       { text: 'Hello', sentByCurrentUser: true },
  //       { text: 'Hi there', sentByCurrentUser: false, sendname: 'Alice' }
  //     ];
  //     const CHAT_LIMIT = 10;
  //     const inputText = 'Test message';
  //     const setInputText = jest.fn();
  //     const handleKeyPress = jest.fn();
  //     const handleMessageSend = jest.fn();

  //     const { getByText, getByPlaceholderText } = render(
  //       <Chat
  //         setIsChatOpen={setIsChatOpen}
  //         messages={messages}
  //         CHAT_LIMIT={CHAT_LIMIT}
  //         inputText={inputText}
  //         setInputText={setInputText}
  //         handleKeyPress={handleKeyPress}
  //         handleMessageSend={handleMessageSend}
  //       />
  //     );

  test("renders chat header and messages correctly", () => {
    const setIsChatOpen = jest.fn(); // Mock function for setIsChatOpen
    const messages = [
      { text: "Hello", sentByCurrentUser: true },
      { text: "Hi there", sentByCurrentUser: false, sendname: "Alice" },
    ];
    const CHAT_LIMIT = 10;

    // Render the Chat component
    const { getByText, getAllByText, queryByText, container } = render(
      <Chat
        setIsChatOpen={setIsChatOpen}
        messages={messages}
        CHAT_LIMIT={CHAT_LIMIT}
        inputText="" // Pass an empty string for inputText
        setInputText={() => {}} // Mock function for setInputText
        handleKeyPress={() => {}} // Mock function for handleKeyPress
        handleMessageSend={() => {}} // Mock function for handleMessageSend
      />
    );

    // Assert that the chat header with text "Chat" is rendered
    expect(getByText("Chat")).toBeInTheDocument();
    messages.forEach((message, index) => {
      const sender = message.sentByCurrentUser ? "You" : message.sendname;
      const foundMessages = getAllByText((content, element) => {
        return element.textContent.includes(`${sender}: ${message.text}`);
      });
      expect(foundMessages.length).toBeGreaterThan(0);
    });
  });

  test("calls handleMessageSend when send button is clicked", () => {
    const setIsChatOpen = jest.fn();
    const messages = [];
    const CHAT_LIMIT = 10;
    const inputText = "Test message";
    const setInputText = jest.fn();
    const handleKeyPress = jest.fn();
    const handleMessageSend = jest.fn();

    const { getByText } = render(
      <Chat
        setIsChatOpen={setIsChatOpen}
        messages={messages}
        CHAT_LIMIT={CHAT_LIMIT}
        inputText={inputText}
        setInputText={setInputText}
        handleKeyPress={handleKeyPress}
        handleMessageSend={handleMessageSend}
      />
    );

    // Click the send button
    fireEvent.click(getByText("Send"));

    // Expect handleMessageSend to have been called
    expect(handleMessageSend).toHaveBeenCalled();
  });
  
  test('calls setIsChatOpen(false) when close icon is clicked', () => {
    const setIsChatOpen = jest.fn(); // Mock setIsChatOpen function
    const messages = [{ text: 'Hello', sentByCurrentUser: true }]; // Mock messages array
    const CHAT_LIMIT = 10;

    const { getByTestId } = render(
      <Chat setIsChatOpen={setIsChatOpen} messages={messages} CHAT_LIMIT={CHAT_LIMIT} />
    ); // Render the component

    const closeIcon = getByTestId('DisabledByDefaultIcon'); // Get the close icon element by test ID
    fireEvent.click(closeIcon); // Simulate click event on the close icon

    expect(setIsChatOpen).toHaveBeenCalledWith(false); // Expect setIsChatOpen to be called with false
  });
});
