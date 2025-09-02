import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import axiosInstance, { getAccessToken, setAccessToken } from "../axiosInstance";
import axios from "axios";

// Suppress expected console.error during tests
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((...args) => {
    const msg = args[0];
    if (typeof msg === "object" && msg?.response?.status === 401) return;
    // You can also filter other expected warnings if needed
    console.log(...args); // Only log unexpected errors
  });
});

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock("../axiosInstance", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  getAccessToken: jest.fn(),
  setAccessToken: jest.fn(),
}));

describe("App Login and Movie Fetching Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form when user is not logged in", () => {
    (getAccessToken as jest.Mock).mockReturnValue(null);
    (axiosInstance.get as jest.Mock).mockRejectedValue(new Error("401 Unauthorized"));

    render(<App />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  test("logs in successfully and shows the main app content", async () => {
    (getAccessToken as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValue("fake_token_123");

    (axios.post as jest.Mock).mockResolvedValue({
      data: { access: "fake_token_123", refresh: "fake_refresh_token" },
    });

    (axiosInstance.get as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
    (axiosInstance.get as jest.Mock).mockResolvedValueOnce({
      data: { results: [{ id: 1, title: "Movie 1", poster_path: "/1", release_date: "2023-01-01" }] },
    });

    (setAccessToken as jest.Mock).mockReturnValue(undefined);

    render(<App />);

    await userEvent.type(screen.getByLabelText(/username/i), "tajiri");
    await userEvent.type(screen.getByLabelText(/password/i), "tajiri");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(setAccessToken).toHaveBeenCalledWith("fake_token_123");
    });

    expect(await screen.findByText(/Movie 1/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  test("shows an error message on failed login", async () => {
    (getAccessToken as jest.Mock).mockReturnValue(null);
    (axios.post as jest.Mock).mockRejectedValue(new Error("401 Unauthorized"));
    (axiosInstance.get as jest.Mock).mockRejectedValue(new Error("401 Unauthorized"));

    render(<App />);

    await userEvent.type(screen.getByLabelText(/username/i), "wronguser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/Invalid username or password/i)).toBeInTheDocument();
  });

  test("fetches and displays movies when logged in", async () => {
    (getAccessToken as jest.Mock).mockReturnValue("fake_token_123");
    (axiosInstance.get as jest.Mock).mockResolvedValue({
      data: { results: [{ id: 1, title: "Movie 1", poster_path: "/1", release_date: "2023-01-01" }] },
    });

    render(<App />);
    expect(await screen.findByText(/Movie 1/i)).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledTimes(1);
  });
});
