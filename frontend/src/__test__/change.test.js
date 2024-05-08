import { render, screen, fireEvent, getByTestId} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import App from '../App';
import { act } from 'react-dom/test-utils';

const axios = require("axios");
import { URL } from "url";

// Mock axios module
jest.mock("axios");
test('renders Menu and handles clicks correctly', async () => {
    // Set up the mock props and functions
    const setMenuOpen = jest.fn();
    const host = { current: "john_doe" };
    const storedUserData = { current: { name: "jane_doe" } };
    const connectedUsers = [{ username: "user1" }, { username: "user2" }]; // Define connected users
    const handleChangeRole = jest.fn();
    const handleUserMenuToggle = jest.fn();
    
    // Render the Sidebar component with necessary props
    render(
        <MemoryRouter>
            <Sidebar
                isConnectedComponentOpen={true}
                connectedUsers={connectedUsers}
                host={host}
                storedUserData={storedUserData}
                setMenuOpen={setMenuOpen}
                handleChangeRole={handleChangeRole}
                handleUserMenuToggle={handleUserMenuToggle}
                menuOpen={{ user1: true }} // Initial state: user1's menu is open
            />
        </MemoryRouter>
    );

    // Simulate a click on the hidden input button to trigger state changes
    act(() => {
        fireEvent.click(screen.getByTestId('inside-hello'));
    });
    await new Promise(process.nextTick);
    act(() => {
        const hiddenButton = screen.getByTestId('inside-menu');
        fireEvent.click(hiddenButton);console.log("hello",handleUserMenuToggle.mock.calls);
    });
    const menuElement = await screen.findByTestId("inside-Menu");
    expect(menuElement).toBeVisible();

    // const insideMenu = screen.getByTestId('inside-Menu');

    // expect(handleUserMenuToggle).toHaveBeenCalledWith('abcd');

    // // Check if the `Menu` component is rendered and visible
    // const menu = screen.getByTestId('inside-menu-item');
    // // expect(menu).toBeVisible();

    // // Check other elements within the `Menu` component
    // // expect(menuElement).toBeVisible();

    // // Check menu-item
    // const menuItem = screen.getByTestId('menuitem');
    // // expect(menuItem).toBeVisible();
    // // If `menuitem` is expected to handle clicks, simulate a click on it
    // fireEvent.click(menuItem);

    // // Verify the `handleChangeRole` function is called with expected argument
    // expect(handleChangeRole).toHaveBeenCalledWith('user1');
});
