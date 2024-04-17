import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Chat from "../components/Chat";
// test('calls handleMessageSend when Enter key is pressed', () => {
//     // Mock function for handleMessageSend
//     const handleMessageSend = jest.fn();

//     // Render the Chat component
//     const { getByPlaceholderText } = render(
//       <Chat
//         setIsChatOpen={jest.fn()}
//         messages={[]}
//         roomId="123"
//         socketRef={{ current: { emit: jest.fn() } }}
//         storedUserData={{ current: { sub: '123', name: 'John' } }}
//       />
//     );

//     // Simulate key press event with the "Enter" key
//     const inputField = getByPlaceholderText('Type your message...');
//     fireEvent.change(inputField, { target: { value: 'Test message' } }); // Set input value
//     fireEvent.keyPress(inputField, { key: 'Enter', code: 'Enter', charCode: 13 });

//     // Expect handleMessageSend to be called
//     expect(handleMessageSend).toHaveBeenCalled();
//   });

describe("handleMessageSend", () => {
  test("calls handleMessageSend correctly when inputText is not empty", () => {
    const mockInputText = "Test message";
    const mockRoomId = "123";
    const mockSender = { sub: "123", name: "John" };
    const emitMock = jest.fn();
    const mockSocketRef = { current: { emit: emitMock } };

    // Render the Chat component
    const { getByText, getByPlaceholderText } = render(
      <Chat
        setIsChatOpen={jest.fn()}
        messages={[]}
        roomId={mockRoomId}
        socketRef={mockSocketRef}
        storedUserData={{ current: mockSender }}
      />
    );

    // Set inputText
    fireEvent.change(getByPlaceholderText("Type your message..."), {
      target: { value: mockInputText },
    });

    // Click send button
    fireEvent.click(getByText("Send"));

    // Expectations
    expect(emitMock).toHaveBeenCalledWith("MESSAGE_SEND", {
      roomId: mockRoomId,
      message: { text: mockInputText },
      sender: mockSender.sub,
      sendname: mockSender.name,
    });
    expect(getByPlaceholderText("Type your message...").value).toBe(""); // Check if inputText is cleared
  });

  test("does not call handleMessageSend when inputText is empty", () => {
    // Mock function for socketRef.current.emit
    const emitMock = jest.fn();
    const mockSocketRef = { current: { emit: emitMock } };

    // Render the Chat component
    const { getByText } = render(
      <Chat
        setIsChatOpen={jest.fn()}
        messages={[]}
        roomId="123"
        socketRef={mockSocketRef}
        storedUserData={{ current: { sub: "123", name: "John" } }}
      />
    );

    // Click send button without setting inputText
    fireEvent.click(getByText("Send"));

    // Expectations
    expect(emitMock).not.toHaveBeenCalled(); // Ensure handleMessageSend is not called
  });
});

describe("Chat component", () => {
  const mockMessages = [
    { text: "Hello", sentByCurrentUser: true, sendname: "User1" },
    { text: "Hi there", sentByCurrentUser: false, sendname: "User2" },
  ];

  const mockSetIsChatOpen = jest.fn();
  const mockSocketRef = { current: { emit: jest.fn() } };
  const mockStoredUserData = { current: { sub: "123", name: "John" } };

  test("renders chat messages correctly", () => {
    const { queryAllByText } = render(
      <Chat
        setIsChatOpen={mockSetIsChatOpen}
        messages={mockMessages}
        roomId="12345"
        socketRef={mockSocketRef}
        storedUserData={mockStoredUserData}
      />
    );

    const foundMessages = queryAllByText((content, element) => {
      return (
        element.textContent.includes("You") &&
        element.textContent.includes("Hello")
      );
    });

    expect(foundMessages.length).toBeGreaterThan(0);
  });

  test("renders chat header with close icon and handles click event", () => {
    // Mock function for setIsChatOpen
    const setIsChatOpen = jest.fn();

    // Render the Chat component
    const { getByTestId } = render(
      <Chat
        setIsChatOpen={setIsChatOpen}
        messages={mockMessages}
        roomId="12345"
        socketRef={mockSocketRef}
        storedUserData={mockStoredUserData}
      />
    );

    // Find the close icon by test ID
    const closeIcon = getByTestId("DisabledByDefaultIcon");

    // Simulate click event on close icon
    fireEvent.click(closeIcon);

    // Assert that setIsChatOpen has been called with false
    expect(setIsChatOpen).toHaveBeenCalledWith(false);
  });

  test("calls handleMessageSend when send button is clicked", () => {
    const { getByText, getByPlaceholderText } = render(
      <Chat
        setIsChatOpen={mockSetIsChatOpen}
        messages={mockMessages}
        roomId="12345"
        socketRef={mockSocketRef}
        storedUserData={mockStoredUserData}
      />
    );

    const inputField = getByPlaceholderText("Type your message...");
    fireEvent.change(inputField, { target: { value: "Test message" } });

    const sendButton = getByText("Send");
    fireEvent.click(sendButton);

    expect(mockSocketRef.current.emit).toHaveBeenCalledWith(
      "MESSAGE_SEND",
      expect.objectContaining({
        roomId: "12345",
        message: { text: "Test message" },
        sender: "123",
        sendname: "John",
      })
    );
  });

  test("calls handleMessageSend when Enter key is pressed", () => {
    const { getByPlaceholderText } = render(
      <Chat
        setIsChatOpen={mockSetIsChatOpen}
        messages={mockMessages}
        roomId="12345"
        socketRef={mockSocketRef}
        storedUserData={mockStoredUserData}
      />
    );

    const inputField = getByPlaceholderText("Type your message...");
    fireEvent.change(inputField, { target: { value: "Test message" } });
    fireEvent.keyPress(inputField, { key: "Enter", code: 13, charCode: 13 });

    expect(mockSocketRef.current.emit).toHaveBeenCalledWith(
      "MESSAGE_SEND",
      expect.objectContaining({
        roomId: "12345",
        message: { text: "Test message" },
        sender: "123",
        sendname: "John",
      })
    );
  });
});
