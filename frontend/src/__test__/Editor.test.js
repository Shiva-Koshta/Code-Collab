import React from 'react';
import { render, act } from '@testing-library/react';
import Editor from '../components/Editor';

// Mock editorRef
const editorRefMock = {
  current: {
     setOption: jest.fn(), // Mock the setOption function
     getValue: jest.fn(), 
    setValue: jest.fn(), 
  },
};




describe('Editor', () => {
  it('should trigger Editor.js properly when socketRef.current changes', () => {
    // Mock socketRef and its current property
    const mockSocketRef = {
      current: {
        on: jest.fn(),
        id: 'mockId' // You may need to provide other necessary properties based on your implementation
      }
    };

    // Render the component with mock socketRef
    render(<Editor editorRef={editorRefMock} socketRef={mockSocketRef} />);

    // Simulate a change in socketRef.current
    act(() => {
      mockSocketRef.current.on.mock.calls[0][1]({ code: 'mockCode', cursorPosition: 'mockCursorPosition' });
    });

    // Check if the Editor.js is triggered properly
    expect(editorRefMock.current.setValue).toHaveBeenCalledWith('mockCode');
    // Mock renderAllCursors or adjust the test accordingly
  });
});


// Mock CodeMirror module
// jest.mock('codemirror', () => {
//   // Mock CodeMirror class
//   const CodeMirror = jest.fn().mockImplementation(() => {
//     // Mock methods and properties
//     return {
//       setValue: jest.fn(),
//       getValue: jest.fn(),
//     };
//   });

//   // Mock CodeMirror mode functions
//   const defineModeMock = jest.fn();
//   const defineMIME = jest.fn();
//   const registerHelper = jest.fn();
//   const defineOption = jest.fn();

//   // Mock CodeMirror addon functions
//   const defineExtension = {
//     closeTag: jest.fn(),
//     closeBrackets: jest.fn(),
//   };

//   return {
//     CodeMirror,
//     defineMode: defineModeMock,
//     defineMIME,
//     registerHelper,
//     defineOption,
//     defineExtension,
//   };
// });


    // it('should set UserName state after retrieving data from local storage', async () => {
    //   // Mock localStorage getItem method
    //   const localStorageMock = {
    //     getItem: jest.fn()
    //   };
    //   global.localStorage = localStorageMock;
  
    //   // Mock the stored user data
    //   const userData = { name: 'John Doe' };
    //   localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(userData));
  
    //   // Render the component
    //   render(<Editor />);
  
    //   // Ensure that UserName state is updated after retrieving data
    //   await waitFor(() => {
    //     expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
    //     expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
    //   });
    // });
  
    // it('should not set UserName state if no data is found in local storage', async () => {
    //   // Mock localStorage getItem method
    //   const localStorageMock = {
    //     getItem: jest.fn()
    //   };
    //   global.localStorage = localStorageMock;
  
    //   // Render the component
    //   render(<Editor />);
  
    //   // Ensure that UserName state is not updated if no data is found
    //   await waitFor(() => {
    //     expect(localStorageMock.getItem).toHaveBeenCalledWith('userData');
    //     expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
    //   });
    // });
  // });
  




















// describe('Editor component', () => {
// //   let socketRef;
// //   let editorRef;
// //   let connectedClients;
// //   let roomId;
// //   let fileContent;

// //   beforeEach(() => {
// //     socketRef = { current: { emit: jest.fn(), on: jest.fn() } };
// //     editorRef = { current: { setValue: jest.fn(), getWrapperElement: jest.fn() } };
// //     connectedClients = { current: [] };
// //     roomId = 'testRoom';
// //     fileContent = 'console.log("Hello, world!")';
// //   });

//   // it('renders textarea within editor container', () => {
//   //   // Render the Editor component
//   //   const { container } = render(<Editor editorRef={editorRefMock} />);

//   //   // Check if the editor container exists
//   //   const editorContainer = container.querySelector('.editor-container');
//   //   expect(editorContainer).toBeInTheDocument();

//   //   // Check if textarea with id "realEditor" exists within the editor container
//   //   const textarea = editorContainer.querySelector('#realEditor');
//   //   expect(textarea).toBeInTheDocument();
//   // });









// //   it('renders editor container', () => {
// //     const { container } = render(
// //       <Editor
// //         socketRef={socketRef}
// //         editorRef={editorRef}
// //         connectedClients={connectedClients}
// //         roomId={roomId}
// //         fileContent={fileContent}
// //       />
// //     );

// //     expect(container.querySelector('.editor-container')).toBeInTheDocument();
// //   });

// //   it('updates editor content when fileContent changes', () => {
// //     const { rerender } = render(
// //       <Editor
// //         socketRef={socketRef}
// //         editorRef={editorRef}
// //         connectedClients={connectedClients}
// //         roomId={roomId}
// //         fileContent={fileContent}
// //       />
// //     );

// //     expect(editorRef.current.setValue).toHaveBeenCalledWith(fileContent);

// //     const newFileContent = 'const x = 10;';
// //     rerender(
// //       <Editor
// //         socketRef={socketRef}
// //         editorRef={editorRef}
// //         connectedClients={connectedClients}
// //         roomId={roomId}
// //         fileContent={newFileContent}
// //       />
// //     );

// //     expect(editorRef.current.setValue).toHaveBeenCalledWith(newFileContent);
// //   });

// //   it('emits code change when editor content changes', () => {
// //     render(
// //       <Editor
// //         socketRef={socketRef}
// //         editorRef={editorRef}
// //         connectedClients={connectedClients}
// //         roomId={roomId}
// //         fileContent={fileContent}
// //       />
// //     );

// //     const newFileContent = 'const x = 10;';
// //     fireEvent.change(editorRef.current, { target: { value: newFileContent } });

// //     expect(socketRef.current.emit).toHaveBeenCalledWith('CODE_CHANGE', {
// //       roomId,
// //       code: newFileContent,
// //     });
// //   });

//   // Add more tests to cover other functionalities such as cursor rendering, event listeners, etc.

// });
